import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { Checkout, CheckoutDocument } from './entities/checkout.entity';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from 'src/order/entities/order.entity';
import { Cart, CartDoc } from 'src/cart/entities/cart.entity';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CheckoutService {
  private stripe: Stripe;

  constructor(
    @InjectModel(Checkout.name) private checkoutModel: Model<CheckoutDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Cart.name) private cartModel: Model<CartDoc>,
    private configService: ConfigService,
  ) {
    const stripeKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }
    this.stripe = new Stripe(stripeKey, {
      apiVersion: '2025-09-30.clover',
    });
  }

  async createCheckoutSession(
    createCheckoutDto: CreateCheckoutDto,
    owner: Types.ObjectId,
  ) {
    // First create the checkout in your database
    const newCheckout = await this.checkoutModel.create({
      user: { _id: owner, name: createCheckoutDto.username },
      checkoutItems: createCheckoutDto.checkoutItems,
      shippingAddress: createCheckoutDto.shippingAddress,
      paymentMethod: 'stripe',
      totalPrice: createCheckoutDto.totalPrice,
      paymentStatus: 'pending',
      isPaid: false,
      customerEmail: createCheckoutDto.customerEmail,
    });

    // Create Stripe line items from checkout items
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      createCheckoutDto.checkoutItems.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images: item.image ? [item.image] : [],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      }));

    // Create Stripe checkout session
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${this.configService.get<string>('FRONTEND_URL')}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${this.configService.get<string>('FRONTEND_URL')}/checkout/cancel?checkout_id=${newCheckout._id}`,
      metadata: {
        checkoutId: (newCheckout as any)._id.toString(),
        userId: owner.toString(),
      },
      customer_email: createCheckoutDto.customerEmail,
    });

    // Store Stripe session ID in checkout
    newCheckout.stripeSessionId = session.id;
    await newCheckout.save();

    return {
      checkoutId: newCheckout._id,
      sessionId: session.id,
      url: session.url,
    };
  }

  async verifyAndCompletePayment(sessionId: string, userId: Types.ObjectId) {
    // Retrieve session from Stripe to verify payment status
    const session = await this.stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      throw new NotFoundException('Stripe session not found');
    }

    // Find the checkout associated with this session
    const checkout = await this.checkoutModel.findOne({
      stripeSessionId: sessionId,
    });

    if (!checkout) {
      throw new NotFoundException('Checkout not found');
    }

    // Verify the checkout belongs to the user
    if (checkout.user._id.toString() !== userId.toString()) {
      throw new BadRequestException('Unauthorized access to checkout');
    }

    // Check if already processed
    if (checkout.isPaid) {
      // First try the most reliable lookup by paymentDetails
      let existingOrder = await this.orderModel.findOne({
        user: userId,
        'paymentDetails.stripeSessionId': sessionId,
      });

      // Fallback: for orders created before paymentDetails field existed
      if (!existingOrder) {
        existingOrder = await this.orderModel
          .findOne({
            'user._id': checkout.user._id,
            isPaid: true,
            totalPrice: checkout.totalPrice,
          })
          .sort({ createdAt: -1 });
      }

      return {
        message: 'Payment already processed',
        checkout,
        order: existingOrder,
      };
    }

    // Verify payment was successful
    if (session.payment_status === 'paid') {
      // Update checkout with payment details
      checkout.isPaid = true;
      checkout.paidAt = new Date();
      checkout.paymentStatus = 'paid';
      const amount = session.amount_total ?? 0;
      checkout.paymentDetails = {
        stripeSessionId: session.id,
        stripePaymentIntentId: session.payment_intent as string,
        amount: amount / 100,
        currency: session.currency ?? 'usd',
      };

      await checkout.save();

      // Automatically finalize and create order
      const order = await this.finalizeCheckout(
        (checkout as any)._id.toString(),
      );

      return {
        message: 'Payment verified and order created',
        checkout,
        order,
      };
    } else {
      // Payment not completed
      checkout.paymentStatus = session.payment_status;
      await checkout.save();

      throw new BadRequestException(
        `Payment not completed. Status: ${session.payment_status}`,
      );
    }
  }

  async updateCheckout(id: string, updateCheckoutDto: any) {
    const checkout = await this.checkoutModel.findById(id);
    if (!checkout) {
      throw new NotFoundException('Checkout not found');
    }

    if (updateCheckoutDto.paymentStatus) {
      checkout.paymentStatus = updateCheckoutDto.paymentStatus;
    }

    if (['paid', 'completed'].includes(updateCheckoutDto.paymentStatus)) {
      checkout.isPaid = true;
      checkout.paidAt = new Date();

      if (updateCheckoutDto.paymentDetails) {
        checkout.paymentDetails = updateCheckoutDto.paymentDetails;
      }
    }

    await checkout.save();
    return checkout;
  }

  async finalizeCheckout(id: string) {
    const checkout = await this.checkoutModel.findById(id);
    if (!checkout) {
      throw new NotFoundException('Checkout not found');
    }

    if (!checkout.isPaid) {
      throw new BadRequestException('Checkout is not paid yet');
    }

    if (checkout.isFinalized) {
      throw new BadRequestException('Checkout is already finalized');
    }

    // Create order from checkout
    const order = await this.orderModel.create({
      user: { _id: checkout.user._id, name: checkout.user.name },
      orderItems: checkout.checkoutItems,
      shippingAddress: checkout.shippingAddress,
      paymentMethod: checkout.paymentMethod,
      totalPrice: checkout.totalPrice,
      isPaid: true,
      paidAt: checkout.paidAt,
      isDelivered: false,
      paymentStatus: checkout.paymentStatus,
      paymentDetails: checkout.paymentDetails,
    });

    // Mark checkout as finalized
    checkout.isFinalized = true;
    checkout.finalizedAt = new Date();
    await checkout.save();

    // Clear user's cart
    await this.cartModel.findOneAndDelete({ owner: checkout.user._id });

    return order;
  }
}
