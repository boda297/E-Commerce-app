import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDoc } from './entities/product.entity';
import { Model } from 'mongoose';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDoc>,
  ) {}

  create(createProductDto: CreateProductDto) {
    const product = new this.productModel(createProductDto);
    return product.save();
  }

  async findAll(query: any) {
    const {
      collection,
      size,
      color,
      gender,
      category,
      minPrice,
      maxPrice,
      sortBy,
      search,
      material,
      brand,
    } = query;
    console.log(query);
    let filterQuery: any = {};
    let sortOptions: any = {};

    // Helper function to handle both string and array inputs
    const normalizeArrayParam = (
      param: string | string[] | undefined,
    ): string[] => {
      if (!param) return [];
      if (Array.isArray(param)) return param;
      return param.split(',').map((item) => item.trim());
    };

    // Filter Logic
    if (collection && collection.toLowerCase() !== 'all') {
      filterQuery.collection = collection;
    }
    if (category && category.toLowerCase() !== 'all') {
      filterQuery.category = category;
    }

    // Handle material (can be array or comma-separated string)
    const materials = normalizeArrayParam(material);
    if (materials.length > 0) {
      filterQuery.material = { $in: materials };
    }

    // Handle brand (can be array or comma-separated string)
    const brands = normalizeArrayParam(brand);
    if (brands.length > 0) {
      filterQuery.brand = { $in: brands };
    }

    // Handle size (can be array or comma-separated string)
    const sizes = normalizeArrayParam(size);
    if (sizes.length > 0) {
      filterQuery.sizes = { $in: sizes };
    }

    // Handle color (can be array or comma-separated string)
    const colors = normalizeArrayParam(color);
    if (colors.length > 0) {
      filterQuery.colors = { $in: colors };
    }

    if (gender) {
      filterQuery.gender = gender;
    }

    if (minPrice || maxPrice) {
      filterQuery.price = {};
      if (minPrice) {
        filterQuery.price.$gte = Number(minPrice);
      }
      if (maxPrice) {
        filterQuery.price.$lte = Number(maxPrice);
      }
    }

    if (search) {
      filterQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Sort Logic
    if (sortBy) {
      switch (sortBy) {
        case 'priceAsc':
          sortOptions = { price: 1 };
          break;
        case 'priceDesc':
          sortOptions = { price: -1 };
          break;
        case 'popularity':
          sortOptions = { rating: -1 };
          break;
        default:
          break;
      }
    }

    const products = await this.productModel
      .find(filterQuery)
      .sort(sortOptions);

    return products;
  }

  async findOne(id: string) {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async findSimilarProducts(id: string) {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const similarProducts = await this.productModel
      .find({
        _id: { $ne: id },
        gender: product.gender,
        category: product.category,
      })
      .limit(5);
    return similarProducts;
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    return this.productModel.findByIdAndUpdate(id, updateProductDto, {
      new: true,
    });
  }

  remove(id: string) {
    return this.productModel.findByIdAndDelete(id).then((result) => {
      if (!result) {
        throw new NotFoundException('Product not found');
      }
      return {
        message: 'Product deleted successfully',
        productId: id,
        productName: result.name,
      };
    });
  }
}
