import { IsString, IsOptional, IsIn, IsObject } from 'class-validator';

export class UpdateCheckoutDto {
  
  @IsString()
  paymentStatus: string;

  @IsObject()
  paymentDetails: {
    stripeSessionId: string;
    stripePaymentIntentId: string;
    amount: number;
    currency: string;
  };
}
