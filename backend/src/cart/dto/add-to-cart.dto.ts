import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  IsUrl,
  IsPositive,
} from 'class-validator';
import { Types } from 'mongoose';

export class AddToCartDTO {
  @IsMongoId()
  @IsNotEmpty()
  product: Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  size: string;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsNumber()
  @IsPositive()
  @Min(1)
  quantity: number;
}
