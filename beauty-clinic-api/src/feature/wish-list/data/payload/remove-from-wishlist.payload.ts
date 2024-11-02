import {IsOptional, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class RemoveFromWishlistPayload {
    @ApiProperty({
        description: 'ID du produit à retirer de la wishlist',
        required: false,
        example: '123e4567-e89b-12d3-a456-426614174001'
    })
    @IsOptional()
    @IsString()
    productId?: string;

    @ApiProperty({
        description: 'ID du soin à retirer de la wishlist',
        required: false,
        example: '123e4567-e89b-12d3-a456-426614174002'
    })
    @IsOptional()
    @IsString()
    careId?: string;
}