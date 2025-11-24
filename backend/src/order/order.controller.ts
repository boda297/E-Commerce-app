import {
  Controller,
  Get,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { MongoIdDTO } from 'src/common/dto/mongoId.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('/my-orders')
  @UseGuards(AuthGuard)
  getUserOrders(@Req() req) {
    return this.orderService.getUserOrders(req.user.sub);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  getOrdersDetails(@Param() params: MongoIdDTO) {
    return this.orderService.getOrdersDetails(params.id);
  }
}
