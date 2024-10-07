import {ApiProperty} from "@nestjs/swagger";

export class AddProductItemToCartPayload {
    @ApiProperty()
    cartId: string;

    @ApiProperty()
    productId: string;

    @ApiProperty()
    quantity: number;
}