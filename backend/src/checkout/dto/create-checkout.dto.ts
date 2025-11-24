import {
  IsString,
  IsArray,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsDateString,
  ValidateNested,
  IsNotEmpty,
  Min,
  IsIn,
  IsMongoId,
  IsEmail,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

class CheckoutItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  image?: string;

  @IsString()
  @IsNotEmpty()
  size: string;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsString()
  productId?: string;
}

class ShippingAddressDto {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @IsString()
  @IsNotEmpty()
  country: string;
}

export class CreateCheckoutDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CheckoutItemDto)
  checkoutItems: CheckoutItemDto[];

  @IsObject()
  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shippingAddress: ShippingAddressDto;

  @IsNumber()
  @IsNotEmpty()
  totalPrice: number;

  @IsEmail()
  @IsNotEmpty()
  customerEmail: string;
}
