import { Controller, Get, Put, Body } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { AddToWishlistPayload } from './data/payload/add-to-wishlist.payload';
import { RemoveFromWishlistPayload } from './data/payload/remove-from-wishlist.payload';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public, UserReq, UserRequest } from '@common/config/metadata';
import {Wishlist} from "./data/model/wishlist.entity";

@ApiTags('wishlist')
@Controller('wishlist')
export class WishlistController {
    constructor(private readonly wishlistService: WishlistService) {}

    @Public()
    @Get()
    @ApiOperation({ summary: 'Get user wishlist' })
    async getWishlist(@UserReq() userReq: UserRequest): Promise<Wishlist> {
        return this.wishlistService.getWishlist(userReq.idUser);
    }

    @Public()
    @Put('add')
    @ApiOperation({ summary: 'Add item to wishlist' })
    @ApiResponse({ status: 200, description: 'Item added to wishlist successfully' })
    async addToWishlist(
        @Body() payload: AddToWishlistPayload,
        @UserReq() userReq: UserRequest
    ): Promise<Wishlist> {
        return this.wishlistService.addToWishlist(userReq.idUser, payload);
    }

    @Public()
    @Put('remove')
    @ApiOperation({ summary: 'Remove item from wishlist' })
    @ApiResponse({ status: 200, description: 'Item removed from wishlist successfully' })
    async removeFromWishlist(
        @Body() payload: RemoveFromWishlistPayload,
        @UserReq() userReq: UserRequest
    ): Promise<Wishlist> {
        return this.wishlistService.removeFromWishlist(userReq.idUser, payload);
    }
}