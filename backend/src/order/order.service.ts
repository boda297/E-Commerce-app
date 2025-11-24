import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './entities/order.entity';
import { Model } from 'mongoose';
import { MongoIdDTO } from 'src/common/dto/mongoId.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async getUserOrders(owner: string) {
    const orders = await this.orderModel
      .find({ 'user._id': owner })
      .sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      throw new NotFoundException('No orders found');
    }

    return orders;
  }

  async getOrdersDetails(id: string) {
    const order = await this.orderModel
      .findById(id)
      .populate('user', 'name email');

    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }
}
