import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from 'src/order/entities/order.entity';

@Injectable()
export class AdminOrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async findAll() {
    const orders = await this.orderModel
      .find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    return orders;
  }

  async updateOrderStatus(id: string, status: string) {
    const order = await this.orderModel.findById(id);
    if (!order) {
      throw new Error('Order not found');
    }
    order.status = status;
    order.isDelivered = status === 'delivered' ? true : order.isDelivered;
    order.deliveredAt = status === 'delivered' ? new Date() : order.deliveredAt;

    if (status === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }
    else if (status === 'pending') {
      order.isDelivered = false;
    }
    else if (status === 'shipped') {
      order.isDelivered = false;
    }
    else if (status === 'cancelled') {
      order.isDelivered = false;
    }
    const updatedOrder = await order.save();
    return updatedOrder;
  }

  async remove(id: string) {
    const order = await this.orderModel.findByIdAndDelete(id);
    if (!order) {
      throw new Error('Order not found');
    }
    return { message: 'Order deleted successfully' };
  }
}
