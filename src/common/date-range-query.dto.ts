import { IsISO8601, IsOptional } from 'class-validator';

// Rango temporal opcional compartido por /stats/summary y GET /sales.
// from/to son instantes ISO-8601 (con zona); `created_at` es timestamptz, asi
// que el filtro respeta la zona horaria del cliente sin conversiones manuales.
export class DateRangeQueryDto {
  @IsOptional()
  @IsISO8601()
  from?: string;

  @IsOptional()
  @IsISO8601()
  to?: string;
}
