import { MigrationInterface, QueryRunner } from 'typeorm';

// El historial filtra ventas por rangos ("hoy", "esta semana") con instantes
// ISO que manda el cliente; con `timestamp` sin zona el rango se corria por el
// offset del telefono. Se convierte a timestamptz preservando los datos: los
// valores viejos se escribieron en la hora local del servidor, que es justo
// como los interpreta el ALTER (usa el TimeZone de la sesion).
export class SalesCreatedAtTimestamptz1784848694599 implements MigrationInterface {
  name = 'SalesCreatedAtTimestamptz1784848694599';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sales" ALTER COLUMN "created_at" TYPE TIMESTAMP WITH TIME ZONE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sales" ALTER COLUMN "created_at" TYPE TIMESTAMP`,
    );
  }
}
