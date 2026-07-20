import { ValueTransformer } from 'typeorm';

/**
 * TypeORM devuelve las columnas `numeric`/`decimal` como string para no perder
 * precision. Para dinero en este dominio (2 decimales) trabajamos con number,
 * asi que convertimos al leer. ponytail: techo conocido -> si algun dia se
 * manejan montos que excedan el rango seguro de un double, volver a string y
 * usar una lib de decimales.
 */
export const numericTransformer: ValueTransformer = {
  to: (value?: number | null) => value,
  from: (value?: string | null) =>
    value === null || value === undefined ? value : parseFloat(value),
};
