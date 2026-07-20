import 'dotenv/config';
import { DataSource } from 'typeorm';
import { buildTypeOrmOptions } from './config/typeorm.config';

/**
 * DataSource usado por el CLI de TypeORM para generar y correr migraciones.
 * La app en runtime NO usa este archivo (usa TypeOrmModule), pero comparten
 * buildTypeOrmOptions() para no divergir.
 */
export default new DataSource(buildTypeOrmOptions());
