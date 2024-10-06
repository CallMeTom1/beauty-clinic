import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

//todo entité image pour le produit
export class UploadProductImagePayload {
    @ApiProperty({
        description: 'The image file to be uploaded for the product.',
        type: 'string',
        format: 'binary',
        example: 'file.png'
    })
    @IsNotEmpty({ message: 'The productImage file cannot be empty.' })
    productImage: any;
}
