import { Controller, Get, UseGuards } from '@nestjs/common';
import { ProductAdminService } from './product-admin.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { Role } from 'src/roles/role.enum';
import { Roles } from 'src/roles/roles.decorator';

@Controller('admin/product-admin')
export class ProductAdminController {
  constructor(private readonly productAdminService: ProductAdminService) {}

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  findAll() {
    return this.productAdminService.findAll();
  }
}
