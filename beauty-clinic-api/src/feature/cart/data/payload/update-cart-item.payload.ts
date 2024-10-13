import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, IsInt, Min } from 'class-validator';

export class UpdateCartItemPayload {
    @ApiProperty({
        description: 'The unique identifier of the product in the cart.',
        example: '01F8MECHZX3TBDSZ7XRADM79XE'
    })
    @IsString({ message: 'The productId must be a string.' })
    @IsNotEmpty({ message: 'The productId cannot be empty.' })
    cartItemId: string;

    @ApiProperty({
        description: 'The new quantity to set for the product in the cart.',
        example: 3
    })
    @IsInt({ message: 'The quantity must be an integer.' })
    @Min(1, { message: 'The quantity must be at least 1.' })
    newQuantity: number;
}
