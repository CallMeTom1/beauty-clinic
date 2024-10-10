import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class RemoveCartItemPayload {
    @ApiProperty({
        description: 'The unique identifier of the product to remove from the cart.',
        example: '01F8MECHZX3TBDSZ7XRADM79XE'
    })
    @IsString({ message: 'The productId must be a string.' })
    @IsNotEmpty({ message: 'The productId cannot be empty.' })
    @Matches(/^[0-9A-HJKMNP-TV-Z]{26}$/, { message: 'The productId must be a valid ULID.' })
    productId: string;
}
