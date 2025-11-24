import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { MongoIdDTO } from 'src/common/dto/mongoId.dto';
import { Roles } from 'src/roles/roles.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { Role } from 'src/roles/role.enum';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll(@Query() query: QueryProductDto) {
    console.log('=== RAW QUERY ===');
    console.log('Type:', typeof query);
    console.log('Keys:', Object.keys(query));
    console.log('Values:', Object.values(query));
    console.log('Full query:', JSON.stringify(query, null, 2));
    console.log('collection:', query.collection);
    console.log('gender:', query.gender);
    console.log('size:', query.size);
    console.log('maxPrice:', query.maxPrice);

    return this.productService.findAll(query);
  }

  @Get(':id')
  findOne(@Param() params: MongoIdDTO) {
    return this.productService.findOne(params.id);
  }

  @Get('/similar/:id')
  findSimilarProducts(@Param() params: MongoIdDTO) {
    return this.productService.findSimilarProducts(params.id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  update(
    @Param() params: MongoIdDTO,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(params.id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param() params: MongoIdDTO) {
    return this.productService.remove(params.id);
  }
}
