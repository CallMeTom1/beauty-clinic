import {ApiProperty} from "@nestjs/swagger";

export class DeletePromoCodePayload {
    @ApiProperty({
        description: 'id du code promo',
    })
    promo_code_id: string;
}