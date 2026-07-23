import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { buildTypeOrmOptions } from './config/typeorm.config';
import { ProductsModule } from './products/products.module';
import { SalesModule } from './sales/sales.module';
import { StatsModule } from './stats/stats.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(buildTypeOrmOptions()),
    // Rate-limit base (60 req/min por IP); /auth lo endurece con @Throttle.
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 60 }]),
    UsersModule,
    AuthModule,
    ProductsModule,
    SalesModule,
    StatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
