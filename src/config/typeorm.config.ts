import { DataSourceOptions } from 'typeorm';
import { Category } from '../products/category.entity';
import { Product } from '../products/product.entity';
import { SaleItem } from '../sales/sale-item.entity';
import { Sale } from '../sales/sale.entity';
import { User } from '../users/user.entity';

/**
 * Opciones de conexion compartidas por la app (TypeOrmModule) y el CLI de
 * migraciones (data-source.ts), para que no se desincronicen. Lee TODO de env;
 * nada de credenciales hardcodeadas.
 */
export function buildTypeOrmOptions(): DataSourceOptions {
  return {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User, Category, Product, Sale, SaleItem],
    migrations: ['dist/migrations/*.js'],
    // En dev se puede activar por env; en prod SIEMPRE false + migraciones.
    synchronize: process.env.DB_SYNC === 'true',
  };
}
