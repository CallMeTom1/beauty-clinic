
import { Controller, Post, Patch, Delete, Param, Body, Get } from '@nestjs/common';
import { CartService } from './cart.service';
import {ApiTags} from "@nestjs/swagger";
import {UserReq, UserRequest} from "@common/config/metadata";
import {Cart} from "./data/model/cart.entity";
import {AddCartItemPayload} from "./data/payload/add-cart-item.payload";
import {UpdateCartItemPayload} from "./data/payload/update-cart-item.payload";
import {RemoveCartItemPayload} from "./data/payload/remove-cart-item.payload";

@ApiTags('cart')
@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @Get()
    async getCart(@UserReq() userReq: UserRequest): Promise<Cart> {
        return this.cartService.getCart(userReq.idUser);
    }

    @Patch()
    async addToCart(
        @Body() payload: AddCartItemPayload,
        @UserReq() userReq: UserRequest
    ): Promise<Cart> {
        return this.cartService.addToCart(userReq.idUser, payload);
    }

    @Patch('update')
    async updateCartItem(
        @Body() payload: UpdateCartItemPayload,
        @UserReq() userReq: UserRequest
    ): Promise<Cart> {
        return this.cartService.updateCartItem(userReq.idUser, payload);
    }

    @Delete()
    async removeFromCart(
        @Body() payload: RemoveCartItemPayload,
        @UserReq() userReq: UserRequest
    ): Promise<Cart> {
        return this.cartService.removeFromCart(userReq.idUser, payload);
    }

}
