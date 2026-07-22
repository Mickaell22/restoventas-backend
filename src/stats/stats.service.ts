import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sale } from '../sales/sale.entity';
import { SummaryQueryDto } from './dto/summary-query.dto';

export interface TopProduct {
  productId: string;
  name: string;
  qty: number;
  revenue: number;
}

export interface StatsSummary {
  total: number;
  count: number;
  topProducts: TopProduct[];
}

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Sale)
    private readonly sales: Repository<Sale>,
  ) {}

  async summary(userId: string, query: SummaryQueryDto): Promise<StatsSummary> {
    const totals = await this.applyRange(
      this.sales
        .createQueryBuilder('sale')
        .select('COALESCE(SUM(sale.total), 0)', 'total')
        .addSelect('COUNT(sale.id)', 'count')
        .where('sale.user_id = :userId', { userId }),
      query,
    ).getRawOne<{ total: string; count: string }>();

    const top = await this.applyRange(
      this.sales
        .createQueryBuilder('sale')
        .innerJoin('sale.items', 'item')
        .innerJoin('item.product', 'product')
        .select('product.id', 'productId')
        .addSelect('product.name', 'name')
        .addSelect('SUM(item.qty)', 'qty')
        .addSelect('SUM(item.subtotal)', 'revenue')
        .where('sale.user_id = :userId', { userId }),
      query,
    )
      .groupBy('product.id')
      .addGroupBy('product.name')
      .orderBy('qty', 'DESC')
      .limit(5)
      .getRawMany<{
        productId: string;
        name: string;
        qty: string;
        revenue: string;
      }>();

    return {
      total: Number(totals?.total ?? 0),
      count: Number(totals?.count ?? 0),
      topProducts: top.map((t) => ({
        productId: t.productId,
        name: t.name,
        qty: Number(t.qty),
        revenue: Number(t.revenue),
      })),
    };
  }

  private applyRange<T extends import('typeorm').SelectQueryBuilder<Sale>>(
    qb: T,
    query: SummaryQueryDto,
  ): T {
    if (query.from) {
      qb.andWhere('sale.created_at >= :from', { from: query.from });
    }
    if (query.to) {
      qb.andWhere('sale.created_at <= :to', { to: query.to });
    }
    return qb;
  }
}
