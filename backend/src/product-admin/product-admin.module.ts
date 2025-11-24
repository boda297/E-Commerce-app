import { Module } from '@nestjs/common';
import { ProductAdminService } from './product-admin.service';
import { ProductAdminController } from './product-admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'src/product/entities/product.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  controllers: [ProductAdminController],
  providers: [ProductAdminService],
})
export class ProductAdminModule {}
