import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

export class UploadCategoryProductImagePayload{
    @ApiProperty({
        description: 'The UUID of the product category.',
        type: 'string',
        example: 'e8b0d37b-54d1-4b7a-9b9a-3bde5db7b524'
    })
    @IsNotEmpty({ message: 'The categoryProductId cannot be empty.' })
    categoryProductId: string;

    @ApiProperty({type: 'string', format: 'binary'})
    productCategoryImage: any;
}