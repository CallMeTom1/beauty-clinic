
import {Controller, Post, Patch, Delete, Param, Body, Get, Put} from '@nestjs/common';
import { CartService } from './cart.service';
import {ApiOperation, ApiTags} from "@nestjs/swagger";
import {UserReq, UserRequest} from "@common/config/metadata";
import {Cart} from "./data/model/cart.entity";
import {AddCartItemPayload} from "./data/payload/add-cart-item.payload";
import {UpdateCartItemPayload} from "./data/payload/update-cart-item.payload";
import {RemoveCartItemPayload} from "./data/payload/remove-cart-item.payload";
import {ApplyPromoCodeCartPayload} from "./data/payload/apply-promo-code-cart.payload";
import {TokenGenerationException, UserNotFoundException} from "@feature/security/security.exception";

@ApiTags('cart')
@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @Get()
    async getCart(@UserReq() userReq: UserRequest): Promise<Cart> {
        if(!userReq){
            throw new UserNotFoundException();
        }
        return this.cartService.getCart(userReq.idUser);
    }

    @Put()
    async addToCart(
        @Body() payload: AddCartItemPayload,
        @UserReq() userReq: UserRequest
    ): Promise<Cart> {
        return this.cartService.addToCart(userReq.idUser, payload);
    }

    @Put('quantity')
    async updateCartItem(
        @Body() payload: UpdateCartItemPayload,
        @UserReq() userReq: UserRequest
    ): Promise<Cart> {
        return this.cartService.updateCartItem(userReq.idUser, payload);
    }

    @Put('delete')
    async removeFromCart(
        @Body() payload: RemoveCartItemPayload,
        @UserReq() userReq: UserRequest
    ): Promise<Cart> {
        console.log('payload', payload)
        return this.cartService.removeFromCart(userReq.idUser, payload);
    }

    @Put('promo')
    @ApiOperation({ summary: 'Appliquer un code promo au panier' })
    async applyPromoCode(
        @UserReq() userReq: UserRequest,
        @Body() payload: ApplyPromoCodeCartPayload
    ): Promise<Cart> {
        console.log(payload)
        return this.cartService.applyPromoCode(userReq.idUser, payload);
    }

    @Delete('promo')
    @ApiOperation({ summary: 'Retirer le code promo du panier' })
    async removePromoCode(
        @UserReq() userReq: UserRequest
    ): Promise<Cart> {
        return this.cartService.removePromoCode(userReq.idUser);
    }

}
