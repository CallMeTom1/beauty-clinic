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

    @ApiProperty({type: 'string', format: 'binary'})
    productImage: any;
}
