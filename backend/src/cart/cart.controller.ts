import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  Req,
  UseGuards,
  Put,
  Get,
} from '@nestjs/common';
import { CartService } from './cart.service';

import { UpdateCartDto } from './dto/update-cart.dto';
import { AddToCartDTO } from './dto/add-to-cart.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @UseGuards(AuthGuard)
  getCart(@Req() req) {
    return this.cartService.getCart(req.user.sub);
  }

  @Post()
  @UseGuards(AuthGuard)
  addToCart(@Body() addToCartDTO: AddToCartDTO, @Req() req) {
    return this.cartService.addToCart(addToCartDTO, req.user.sub);
  }

  @Put()
  @UseGuards(AuthGuard)
  updateCart(@Body() updateCartDto: UpdateCartDto, @Req() req) {
    return this.cartService.updateCartItems(updateCartDto, req.user.sub);
  }

  @Delete()
  @UseGuards(AuthGuard)
  removeItemFromCart(@Body() updateCartDto: UpdateCartDto, @Req() req) {
    return this.cartService.removeItemFromCart(updateCartDto, req.user.sub);
  }
}
