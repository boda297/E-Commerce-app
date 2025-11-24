import { Injectable } from '@nestjs/common';
import { Product, ProductDoc } from 'src/product/entities/product.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ProductAdminService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDoc>,
  ) {}

  async findAll() {
    const products = await this.productModel.find().exec();
    return products;
  }
}
