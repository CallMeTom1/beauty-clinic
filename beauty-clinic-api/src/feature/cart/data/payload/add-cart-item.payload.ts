import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, IsInt, Min } from 'class-validator';

export class AddCartItemPayload {
    @ApiProperty({
        description: 'The unique identifier of the product to add to the cart.',
        example: '01F8MECHZX3TBDSZ7XRADM79XE'
    })
    @IsString({ message: 'The productId must be a string.' })
    @IsNotEmpty({ message: 'The productId cannot be empty.' })
    @Matches(/^[0-9A-HJKMNP-TV-Z]{26}$/, { message: 'The productId must be a valid ULID.' })
    productId: string;

    @ApiProperty({
        description: 'The quantity of the product to add to the cart.',
        example: 2
    })
    @IsInt({ message: 'The quantity must be an integer.' })
    @Min(1, { message: 'The quantity must be at least 1.' })
    quantity: number;
}
