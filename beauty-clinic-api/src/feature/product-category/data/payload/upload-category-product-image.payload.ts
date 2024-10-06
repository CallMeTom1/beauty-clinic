import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UploadCategoryProductImagePayload {
    @ApiProperty({
        description: 'The image file to be uploaded for the product category.',
        type: 'string',
        format: 'binary',
        example: 'file.png'
    })
    @IsNotEmpty({ message: 'The productCategoryImage file cannot be empty.' })
    productCategoryImage: any;
}
