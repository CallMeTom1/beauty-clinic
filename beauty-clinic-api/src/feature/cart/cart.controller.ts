
import { Controller, Post, Patch, Delete, Param, Body, Get } from '@nestjs/common';
import { CartService } from './cart.service';
import {ApiTags} from "@nestjs/swagger";

@ApiTags('cart')
@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @Post(':cartId/add')
    async addToCart(
        @Param('cartId') cartId: number,
        @Body('productId') productId: string,
        @Body('quantity') quantity: number,
    ) {
        return this.cartService.addToCart(cartId, productId, quantity);
    }

    @Patch(':cartId/update')
    async updateCartItem(
        @Param('cartId') cartId: number,
        @Body('productId') productId: string,
        @Body('quantity') quantity: number,
    ) {
        return this.cartService.updateCartItem(cartId, productId, quantity);
    }

    @Delete(':cartId/remove')
    async removeFromCart(
        @Param('cartId') cartId: number,
        @Body('productId') productId: string,
    ) {
        return this.cartService.removeFromCart(cartId, productId);
    }

    @Get(':cartId')
    async getCart(@Param('cartId') cartId: number) {
        return this.cartService.getCart(cartId);
    }
}
