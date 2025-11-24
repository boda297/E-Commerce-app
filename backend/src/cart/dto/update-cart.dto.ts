import { PartialType } from '@nestjs/mapped-types';
import { AddToCartDTO } from './add-to-cart.dto';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';
import { Types } from 'mongoose';

export class UpdateCartDto extends PartialType(AddToCartDTO) {
  @IsMongoId()
  @IsNotEmpty()
  product: Types.ObjectId;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsString()
  size: string;

  @IsString()
  color: string;
}
