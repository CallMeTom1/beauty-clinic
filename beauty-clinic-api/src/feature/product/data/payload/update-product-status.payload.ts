import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

export class UpdateProductStatusPayload {
    @ApiProperty({
        description: 'The ULID of the product to update.',
        example: 'e8b0d37b-54d1-4b7a-9b9a-3bde5db7b524',
        type: 'string'
    })
    @IsNotEmpty({ message: 'The id cannot be empty.' })
    id: string;
}