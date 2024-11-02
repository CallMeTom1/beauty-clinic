import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString} from "class-validator";

export class DeleteProductPayload {
    @ApiProperty({
        description: 'Unique identifier of the product to remove.',
        example: 'ulid'
    })
    product_id: string;
}