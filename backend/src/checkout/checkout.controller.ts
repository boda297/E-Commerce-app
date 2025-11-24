// checkout.controller.ts
import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  Get,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { UpdateCheckoutDto } from './dto/update-checkout.dto';
import { Types } from 'mongoose';
import { MongoIdDTO } from 'src/common/dto/mongoId.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/role.enum';

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post('create-checkout-session')
  @UseGuards(AuthGuard)
  async createCheckoutSession(
    @Body() createCheckoutDto: any,
    @Request() req: any,
  ) {
    const result = await this.checkoutService.createCheckoutSession(
      createCheckoutDto,
      req.user.sub,
    );

    return result;
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async updateCheckout(
    @Param() params: MongoIdDTO,
    @Body() updateCheckoutDto: any,
  ) {
    return this.checkoutService.updateCheckout(params.id, updateCheckoutDto);
  }

  @Post('verify-payment')
  @UseGuards(AuthGuard)
  async verifyAndCompletePayment(
    @Query('session_id') sessionId: string,
    @Request() req: any,
  ) {
    return this.checkoutService.verifyAndCompletePayment(
      sessionId,
      req.user.sub,
    );
  }

  @Post(':id/finalize')
  async finalizeCheckout(@Param() params: MongoIdDTO) {
    return this.checkoutService.finalizeCheckout(params.id);
  }
}
