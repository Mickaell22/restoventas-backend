import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly products: Repository<Product>,
  ) {}

  findAll(): Promise<Product[]> {
    return this.products.find({
      relations: { category: true },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.products.findOne({
      where: { id },
      relations: { category: true },
    });
    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }
    return product;
  }

  create(dto: CreateProductDto): Promise<Product> {
    const product = this.products.create({
      name: dto.name,
      price: dto.price,
      categoryId: dto.categoryId ?? null,
      active: dto.active ?? true,
    });
    return this.products.save(product);
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    if (dto.name !== undefined) product.name = dto.name;
    if (dto.price !== undefined) product.price = dto.price;
    if (dto.categoryId !== undefined) product.categoryId = dto.categoryId;
    if (dto.active !== undefined) product.active = dto.active;
    return this.products.save(product);
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.products.delete(id);
      if (!result.affected) {
        throw new NotFoundException('Producto no encontrado');
      }
    } catch (e) {
      // El FK RESTRICT de sale_items impide borrar un producto ya vendido.
      // Codigo de Postgres 23503 = foreign_key_violation.
      if (e instanceof QueryFailedError && (e.driverError as { code?: string }).code === '23503') {
        throw new ConflictException(
          'No se puede eliminar: el producto tiene ventas registradas. Desactivalo en su lugar.',
        );
      }
      throw e;
    }
  }
}
