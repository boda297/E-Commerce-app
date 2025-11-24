import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';
import { CheckoutModule } from './checkout/checkout.module';
import { OrderModule } from './order/order.module';
import { UploadModule } from './upload/upload.module';
import { ProductAdminModule } from './product-admin/product-admin.module';
import { AdminOrdersModule } from './admin-orders/admin-orders.module';
import paymobConfig from './config/paymob.config';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({ isGlobal: true, load: [paymobConfig] }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('CONNECTION_STRING');
        if (!uri) throw new Error('CONNECTION_STRING is not defined');
        return { uri };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    ProductModule,
    CartModule,
    CheckoutModule,
    OrderModule,
    UploadModule,
    ProductAdminModule,
    AdminOrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
