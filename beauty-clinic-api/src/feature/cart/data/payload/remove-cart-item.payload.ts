import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class RemoveCartItemPayload {
    @ApiProperty({
        description: 'The unique identifier of the product to remove from the cart.',
        example: '01F8MECHZX3TBDSZ7XRADM79XE'
    })
    cartItemId: string;
}
