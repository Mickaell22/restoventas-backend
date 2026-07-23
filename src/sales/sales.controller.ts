import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DateRangeQueryDto } from '../common/date-range-query.dto';
import { CreateSaleDto } from './dto/create-sale.dto';
import { SalesService } from './sales.service';

@UseGuards(JwtAuthGuard)
@Controller('sales')
export class SalesController {
  constructor(private readonly sales: SalesService) {}

  @Get()
  findAll(@CurrentUser() user: AuthUser, @Query() range: DateRangeQueryDto) {
    return this.sales.findAll(user.id, range);
  }

  @Get(':id')
  findOne(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.sales.findOne(user.id, id);
  }

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateSaleDto) {
    return this.sales.create(user.id, dto);
  }
}
