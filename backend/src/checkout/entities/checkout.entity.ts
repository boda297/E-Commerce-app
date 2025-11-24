import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { PaymentDetails } from '../interfaces/payment-details.interface';

@Schema({ _id: false })
export class CheckoutItem {
  @Prop({ type: Types.ObjectId, ref: Product.name, required: true })
  productId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true })
  size: string;

  @Prop({ required: true })
  color: string;

  @Prop({ required: true, min: 1 })
  quantity: number;

}

export const CheckoutItemSchema = SchemaFactory.createForClass(CheckoutItem);

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

export type CheckoutDocument = Checkout & Document;

@Schema({ timestamps: true })
export class Checkout {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: { _id: Types.ObjectId; name: string };

  @Prop({ type: [CheckoutItemSchema], required: true })
  checkoutItems: CheckoutItem[];

  @Prop({ type: ShippingAddressSchema, required: true })
  shippingAddress: ShippingAddress;

  @Prop({ required: true })
  paymentMethod: string;

  @Prop({ required: true, min: 0 })
  totalPrice: number;

  @Prop({ required: true })
  customerEmail: string;

  @Prop()
  stripeSessionId: string;

  @Prop({ default: false })
  isPaid: boolean;

  @Prop({ type: Date })
  paidAt: Date;

  @Prop({
    default: 'pending',
    enum: ['pending', 'processing', 'completed', 'paid', 'failed', 'expired'],
  })
  paymentStatus: string;

  @Prop({ type: Object })
  paymentDetails: PaymentDetails;

  @Prop({ default: false })
  isFinalized: boolean;

  @Prop({ type: Date })
  finalizedAt: Date;
}

export const CheckoutSchema = SchemaFactory.createForClass(Checkout);
