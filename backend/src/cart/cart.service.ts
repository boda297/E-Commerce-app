import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartDoc } from './entities/cart.entity';
import { Model, Types } from 'mongoose';
import { AddToCartDTO } from './dto/add-to-cart.dto';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDoc>,
    private productService: ProductService,
  ) {}

  async getCart(owner: Types.ObjectId) {
    // Convert owner to ObjectId if it's a string
    const ownerObjectId =
      typeof owner === 'string' ? new Types.ObjectId(owner) : owner;
    // find user Cart
    let cart = await this.cartModel.findOne({
      owner: { $in: [ownerObjectId, ownerObjectId.toString()] },
    });
    if (!cart) {
      // Create an empty cart for first-time users
      cart = new this.cartModel({
        owner: ownerObjectId,
        items: [],
        totalAmount: 0,
      });
      await cart.save();
    }
    return cart;
  }

  async addToCart(
    addToCartDTO: AddToCartDTO,
    owner: Types.ObjectId,
  ): Promise<Cart> {
    try {
      const ownerObjectId =
        typeof owner === 'string' ? new Types.ObjectId(owner) : owner;
      // Find product in database
      const product = await this.productService.findOne(
        addToCartDTO.product.toString(),
      );

      if (!product) {
        throw new NotFoundException('Product not found!');
      }

      // Try to find existing cart for this user
      let cart = await this.cartModel.findOne({
        owner: { $in: [ownerObjectId, ownerObjectId.toString()] },
      });

      if (cart) {
        // Cart exists - check if item with same product, size, and color exists
        const existingItemIndex = cart.items.findIndex(
          (item) =>
            item.product.toString() === addToCartDTO.product.toString() &&
            item.size === addToCartDTO.size &&
            item.color === addToCartDTO.color,
        );

        if (existingItemIndex > -1) {
          // Same item exists - increase quantity
          cart.items[existingItemIndex].quantity += addToCartDTO.quantity;
        } else {
          // Different item - add new item to existing cart
          const newCartItem = {
            product: addToCartDTO.product,
            name: product.name,
            image: product.images[0]?.url || '',
            price: product.price,
            size: addToCartDTO.size,
            color: addToCartDTO.color,
            quantity: addToCartDTO.quantity,
          };
          cart.items.push(newCartItem);
        }
      } else {
        // No cart exists - create new cart with first item
        const cartItem = {
          product: addToCartDTO.product,
          name: product.name,
          image: product.images[0]?.url || '',
          price: product.price,
          size: addToCartDTO.size,
          color: addToCartDTO.color,
          quantity: addToCartDTO.quantity,
        };

        cart = new this.cartModel({
          owner: ownerObjectId,
          items: [cartItem],
          totalAmount: 0, // Will be calculated below
        });
      }

      // Recalculate total amount for all items
      cart.totalAmount = this.calculateTotalAmount(cart.items);

      // Save and return cart
      await cart.save();
      return cart;
    } catch (error) {
      // Re-throw known errors
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      // Log and throw generic error for unexpected issues
      console.error('Error in addToCart:', error);
      throw new BadRequestException('Failed to add item to cart');
    }
  }

  // Helper method to calculate total amount
  private calculateTotalAmount(items: any[]): number {
    const total = items.reduce(
      (acc, item) => acc + Number(item.price) * item.quantity,
      0,
    );
    return Math.round(total * 100) / 100;
  }

  async updateCartItems(updateCartDto: UpdateCartDto, owner: Types.ObjectId) {
    let cart = await this.getCart(owner);
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const productIndex = cart.items.findIndex(
      (p) =>
        p.product.toString() === updateCartDto.product?.toString() &&
        p.size === updateCartDto.size &&
        p.color === updateCartDto.color,
    );

    if (productIndex === -1) {
      throw new NotFoundException('Item not found in cart');
    }

    if (!updateCartDto.quantity || updateCartDto.quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than 0');
    }

    // Update the quantity
    cart.items[productIndex].quantity = updateCartDto.quantity;

    // Recalculate total amount
    cart.totalAmount = cart.items.reduce(
      (acc, item) => acc + Number(item.price) * item.quantity,
      0,
    );
    // Save and return updated cart
    await cart.save();
    return cart;
  }

  async removeItemFromCart(
    updateCartDto: UpdateCartDto,
    owner: Types.ObjectId,
  ) {
    const cart = await this.getCart(owner);
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const productIndex = cart.items.findIndex(
      (p) =>
        p.product.toString() === updateCartDto.product?.toString() &&
        p.size === updateCartDto.size &&
        p.color === updateCartDto.color,
    );

    if (productIndex === -1) {
      throw new NotFoundException('Item not found in cart');
    }

    // Remove item from cart
    cart.items.splice(productIndex, 1);

    // Recalculate total amount
    cart.totalAmount = cart.items.reduce(
      (acc, item) => acc + Number(item.price) * item.quantity,
      0,
    );

    // Save and return updated cart
    await cart.save();
    return cart;
  }
}
