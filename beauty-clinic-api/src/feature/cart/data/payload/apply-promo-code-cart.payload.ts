import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString} from "class-validator";

export class ApplyPromoCodeCartPayload {
    @ApiProperty({
        description: 'The promo code ',
        example: 'WINTER30'
    })
    @IsString({ message: 'The productId must be a string.' })
    @IsNotEmpty({ message: 'The productId cannot be empty.' })
    code: string;
}