# RestoVentas — Backend (CLAUDE.md)

API REST en NestJS + TypeORM + PostgreSQL + JWT. Aca van las decisiones e
invariantes del proyecto (el "por que"), no el changelog. Para instalar/correr,
ver `README.md`.

## Invariantes que NO se deben romper
- **Los precios de venta se recalculan SIEMPRE en el servidor.** `SalesService.create`
  toma `unitPrice`/`subtotal`/`total` del precio real del producto en la BD via
  `computeSaleTotals` (`src/sales/sale-totals.ts`); nunca se confia en montos que
  mande el cliente. El cliente solo envia `{ productId, qty }`.
- **El catalogo de productos es compartido** entre todos los usuarios: `Product`
  no tiene `userId` (asi lo define el modelo del plan). Las **ventas si** son por
  usuario (`Sale.userId`) y los endpoints de ventas/stats filtran por el usuario
  del token. Por eso no hay roles admin: cualquier usuario autenticado gestiona
  el catalogo. Si algun dia se quiere multi-tenant, hay que agregar `userId` a
  `Product` (cambio de modelo + migracion).
- **Nada hardcodeado.** Toda config (DB, JWT, IA) va por env (`.env` / `.env.example`).
  `buildTypeOrmOptions` valida que existan `DB_HOST/USER/PASSWORD/NAME` y falla
  claro al arrancar si falta alguna.
- **Esquema por migraciones, no `synchronize`.** En prod `DB_SYNC` debe ser false;
  los cambios de entidades se versionan con `migration:generate` + `migration:run`.

## Decisiones / gotchas
- **`numericTransformer`** (`src/common/numeric.transformer.ts`): las columnas
  `numeric(10,2)` (price, total, unitPrice, subtotal) se exponen como `number`
  en JS (pg las entrega como string). No tratarlas como string en el codigo.
- **`UpdateProductDto.categoryId` acepta `null`** para desasignar la categoria.
  Funciona porque `@IsOptional()` en class-validator omite las demas
  validaciones cuando el valor es `null` o `undefined` (por eso `@IsUUID()` no lo
  rechaza). Si una auditoria marca esto como bug, es falso positivo.
- **DELETE de un producto con ventas devuelve 409**, no 500: hay FK `RESTRICT`
  desde `sale_items`. La via correcta para "sacar" un producto vendido es
  desactivarlo (`active = false`), no borrarlo.
- **Auth:** todos los endpoints van bajo `JwtAuthGuard` salvo `/auth/register` y
  `/auth/login`. `JWT_SECRET` es obligatorio: `JwtStrategy` lanza al arrancar si
  falta. `/auth/login` y `/auth/register` tienen rate-limit de 5/min por IP
  (`@nestjs/throttler`); el resto usa el limite global de 60/min.
- **Escucha en `*:3000`** (todas las interfaces), asi la app en un telefono
  fisico lo alcanza por la IP LAN de la PC. Ver el CLAUDE.md de la app para el
  flujo de prueba por WiFi.
