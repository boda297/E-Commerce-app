import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/users/entities/user.entity';

@Schema()
export class CartItem {
  @Prop({ ref: Product.name, type: Types.ObjectId })
  product: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  size: string;

  @Prop({ required: true })
  color: string;

  @Prop({ required: true, default: 1 })
  quantity: number;
}
export const CartItemSchema = SchemaFactory.createForClass(CartItem);

export type CartDoc = Cart & Document;

@Schema()
export class Cart {
  @Prop({ type: [CartItem], default: [] })
  items: CartItem[];

  @Prop({ type: Types.ObjectId, ref: User.name })
  owner: Types.ObjectId;

  @Prop({ required: true, default: 0 })
  totalAmount: number;

}

export const CartSchema = SchemaFactory.createForClass(Cart);
