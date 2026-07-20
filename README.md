# RestoVentas — Backend

API REST para RestoVentas: productos, ventas, estadísticas y parseo de pedidos con IA.

> Estado: en desarrollo.

## Stack

- NestJS + TypeScript
- PostgreSQL + TypeORM
- Auth con JWT
- IA: DeepSeek (parseo de pedidos en lenguaje natural)

## Modelo de datos

```
User(id, email, passwordHash, name)
Category(id, name)
Product(id, name, price, categoryId, active)
Sale(id, createdAt, total, paymentMethod, userId)
SaleItem(id, saleId, productId, qty, unitPrice, subtotal)
```

## Endpoints

```
POST /auth/register · POST /auth/login        -> JWT
GET/POST/PATCH/DELETE /products               -> CRUD productos
GET/POST /sales · GET /sales/:id              -> registrar y listar ventas
GET /stats/summary?from&to                    -> totales, top productos
POST /ai/parse-order  { text }                -> IA: texto -> items[]
```

## Cómo correr

```bash
npm install
cp .env.example .env   # completar credenciales de DB y API key de IA
npm run start:dev
```

Requiere PostgreSQL local (Docker o instalación local).

## Cliente

- App móvil: [restoventas-app](https://github.com/Mickaell22/restoventas-app) (Expo / React Native)
