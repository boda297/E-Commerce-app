export interface PaymentDetails {
  stripeSessionId: string;
  stripePaymentIntentId?: string;
  amount: number;
  currency: string;
}
