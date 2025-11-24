import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/role.enum';
import { RolesGuard } from 'src/roles/roles.guard';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('product-image')
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const result = await this.uploadService.uploadProductImage(file);
    return {
      success: true,
      data: result,
      message: 'Image uploaded successfully',
    };
  }

  @Post('product-images')
  @UseInterceptors(FilesInterceptor('images', 5)) // Max 5 images
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async uploadProductImages(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    const results = await this.uploadService.uploadProductImages(files);
    return {
      success: true,
      data: results,
      message: `${results.length} images uploaded successfully`,
    };
  }

  @Delete('image/:publicId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async deleteImage(@Param('publicId') publicId: string) {
    const result = await this.uploadService.deleteImage(publicId);
    return {
      success: true,
      data: result,
      message: 'Image deleted successfully',
    };
  }
}
