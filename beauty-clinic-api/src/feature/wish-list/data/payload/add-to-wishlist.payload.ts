import {IsOptional, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class AddToWishlistPayload {
    @ApiProperty({
        description: 'ID du produit à ajouter à la wishlist',
        required: false,
        example: '123e4567-e89b-12d3-a456-426614174001'
    })
    @IsOptional()
    @IsString()
    productId?: string;

    @ApiProperty({
        description: 'ID du soin à ajouter à la wishlist',
        required: false,
        example: '123e4567-e89b-12d3-a456-426614174002'
    })
    @IsOptional()
    @IsString()
    careId?: string;
}