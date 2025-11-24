import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsStrongPassword({
    minLowercase: 4,
  })
  password: string;
  @IsOptional()
  @IsNumber()
  age?: number;

  @IsOptional()
  @IsString()
  @IsEnum(['user', 'admin'])
  role?: string;
}
