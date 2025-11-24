import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/users/entities/user.entity';

export type ProductDoc = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ min: 0 })
  discountPrice: number;

  @Prop({ required: true, default: 0, min: 0 })
  stock: number;

  @Prop({ required: true, unique: true })
  sku: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true, type: [String] })
  sizes: string[];

  @Prop({ required: true, type: [String] })
  colors: string[];

  @Prop({ required: true })
  collections: string;

  @Prop()
  material: string;

  @Prop({ required: true, enum: ['Men', 'Women', 'Unisex'] })
  gender: string;

  @Prop({ required: true, type: [{ url: String, alt: String }] })
  images: { url: string; alt: string }[];

  @Prop({ default: false })
  isFeatured: boolean;

  @Prop({ default: false })
  isPublished: boolean;

  @Prop({ default: 0, min: 0, max: 5 })
  rating: number;

  @Prop({ default: 0, min: 0 })
  numReviews: number;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: Types.ObjectId, ref: User.name })
  user: Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
