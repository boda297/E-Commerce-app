import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/users/entities/user.entity';

@Schema({ _id: false })
export class OrderItem {
  @Prop({ type: Types.ObjectId, ref: Product.name, required: true })
  productId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true, min: 1 })
  quantity: number;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({ _id: false })
export class ShippingAddress {
  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  postalCode: string;

  @Prop({ required: true })
  country: string;
}

export const ShippingAddressSchema =
  SchemaFactory.createForClass(ShippingAddress);

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: { _id: Types.ObjectId; name: string };

  @Prop({ type: [OrderItemSchema], required: true })
  orderItems: OrderItem[];

  @Prop({ type: ShippingAddressSchema, required: true })
  shippingAddress: ShippingAddress;

  @Prop({ required: true })
  paymentMethod: string;

  @Prop({ required: true, min: 0 })
  totalPrice: number;

  @Prop({ default: false })
  isPaid: boolean;

  @Prop({ type: Date })
  paidAt: Date;

  @Prop({ default: false })
  isDelivered: boolean;

  @Prop({ type: Date })
  deliveredAt: Date;

  @Prop({
    default: 'pending',
  })
  paymentStatus: string;

  @Prop({ type: Object })
  paymentDetails: any;

  @Prop({
    default: 'Processing',
  })
  status: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
