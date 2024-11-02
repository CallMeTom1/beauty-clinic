import {IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class ApplyPromoCodePayload {
    @ApiProperty({
        description: 'Code promo à appliquer',
        example: 'SUMMER30'
    })
    @IsString()
    code: string;
}