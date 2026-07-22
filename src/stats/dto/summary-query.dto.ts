import { IsISO8601, IsOptional } from 'class-validator';

// from/to son instantes ISO-8601 (opcionales). Si se manda solo la fecha
// (YYYY-MM-DD), el cliente debe enviar el fin de dia en `to` para incluirlo.
export class SummaryQueryDto {
  @IsOptional()
  @IsISO8601()
  from?: string;

  @IsOptional()
  @IsISO8601()
  to?: string;
}
