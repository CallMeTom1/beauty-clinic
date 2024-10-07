import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

//todo entité image pour le produit
export class UploadProductImagePayload {
    @ApiProperty({
        description: 'The UUID of the product .',
        type: 'string',
        example: 'e8b0d37b-54d1-4b7a-9b9a-3bde5db7b524'
    })
    @IsNotEmpty({ message: 'The categoryProductId cannot be empty.' })
    productId: string;

    @ApiProperty({
        description: 'The image file to be uploaded for the product.',
        type: 'string',
        format: 'binary',
        example: 'file.png'
    })
    @IsNotEmpty({ message: 'The productImage file cannot be empty.' })
    productImage: any;
}
