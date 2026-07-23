import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsPositive,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import type { PaymentMethod } from '../sale.entity';

const PAYMENT_METHODS: PaymentMethod[] = ['cash', 'card', 'transfer', 'other'];

export class SaleItemDto {
  @IsUUID()
  productId: string;

  @IsInt()
  @IsPositive()
  qty: number;
}

export class CreateSaleDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SaleItemDto)
  items: SaleItemDto[];

  @IsOptional()
  @IsIn(PAYMENT_METHODS)
  paymentMethod?: PaymentMethod;
}
