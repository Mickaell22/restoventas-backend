import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  In,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { DateRangeQueryDto } from '../common/date-range-query.dto';
import { Product } from '../products/product.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
import { computeSaleTotals } from './sale-totals';
import { SaleItem } from './sale-item.entity';
import { Sale } from './sale.entity';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private readonly sales: Repository<Sale>,
    @InjectRepository(Product)
    private readonly products: Repository<Product>,
  ) {}

  async create(userId: string, dto: CreateSaleDto): Promise<Sale> {
    const ids = [...new Set(dto.items.map((i) => i.productId))];
    const products = await this.products.find({ where: { id: In(ids) } });

    // Todos los productos deben existir y estar activos. El precio se toma de
    // la BD, nunca del cliente (evita manipulacion de precios).
    const byId = new Map(products.map((p) => [p.id, p]));
    for (const id of ids) {
      const product = byId.get(id);
      if (!product) {
        throw new BadRequestException(`Producto inexistente: ${id}`);
      }
      if (!product.active) {
        throw new BadRequestException(`Producto inactivo: ${product.name}`);
      }
    }

    const priceByProductId = new Map(products.map((p) => [p.id, p.price]));
    const { lines, total } = computeSaleTotals(dto.items, priceByProductId);

    const sale = this.sales.create({
      userId,
      paymentMethod: dto.paymentMethod ?? 'cash',
      total,
      items: lines.map((l) =>
        Object.assign(new SaleItem(), {
          productId: l.productId,
          qty: l.qty,
          unitPrice: l.unitPrice,
          subtotal: l.subtotal,
        }),
      ),
    });
    return this.sales.save(sale);
  }

  findAll(userId: string, range: DateRangeQueryDto = {}): Promise<Sale[]> {
    const createdAt =
      range.from && range.to
        ? Between(new Date(range.from), new Date(range.to))
        : range.from
          ? MoreThanOrEqual(new Date(range.from))
          : range.to
            ? LessThanOrEqual(new Date(range.to))
            : undefined;

    return this.sales.find({
      where: { userId, ...(createdAt && { createdAt }) },
      // items (sin product) alcanza para mostrar el conteo de lineas en el
      // historial; el detalle completo lo trae findOne.
      relations: { items: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(userId: string, id: string): Promise<Sale> {
    const sale = await this.sales.findOne({
      where: { id, userId },
      relations: { items: { product: true } },
    });
    if (!sale) {
      throw new NotFoundException('Venta no encontrada');
    }
    return sale;
  }
}
