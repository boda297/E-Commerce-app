import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as streamifier from 'streamifier';
import { CloudinaryConfigService } from '../config/cloudinary.config';

export interface UploadResult {
  imageUrl: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
}

@Injectable()
export class UploadService {
  private readonly allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
  ];

  constructor(private cloudinaryConfigService: CloudinaryConfigService) {}

  private streamUpload(
    fileBuffer: Buffer,
    folder: string = 'products',
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const uploadOptions = {
        resource_type: 'image' as const,
        folder: folder,
        transformation: [
          { width: 1000, crop: 'limit' },
          { quality: 'auto:good' },
        ],
      };

      const cloudinary = this.cloudinaryConfigService.getCloudinary();
      const stream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error || new Error('Upload failed'));
          }
        },
      );

      streamifier.createReadStream(fileBuffer).pipe(stream);
    });
  }

  private validateFile(file: Express.Multer.File): void {
    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${this.allowedMimeTypes.join(', ')}`,
      );
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException(
        'File size too large. Maximum size is 5MB.',
      );
    }
  }

  async uploadProductImage(file: Express.Multer.File): Promise<UploadResult> {
    this.validateFile(file);

    try {
      const result = await this.streamUpload(file.buffer, 'products');

      return {
        imageUrl: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
      };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new InternalServerErrorException(
        error.message || 'Failed to upload image to Cloudinary',
      );
    }
  }

  async uploadProductImages(
    files: Express.Multer.File[],
  ): Promise<UploadResult[]> {
    const uploadPromises = files.map((file) => this.uploadProductImage(file));
    return Promise.all(uploadPromises);
  }

  async deleteImage(publicId: string): Promise<any> {
    try {
      const cloudinary = this.cloudinaryConfigService.getCloudinary();
      const result = await cloudinary.uploader.destroy(publicId);

      if (result.result !== 'ok') {
        throw new Error('Failed to delete image');
      }

      return result;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to delete image from Cloudinary',
      );
    }
  }
}
