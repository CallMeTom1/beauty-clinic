import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class AddCategoryToProductPayload {
    @ApiProperty({
        description: 'ID of the product.',
        example: 'prod_12345'
    })
    @IsString({ message: 'The product_id must be a string.' })
    @IsNotEmpty({ message: 'The product_id field cannot be empty.' })
    product_id: string;

    @ApiProperty({
        description: 'ID of the category to add to the product.',
        example: 'cat_12345'
    })
    @IsString({ message: 'The category_id must be a string.' })
    @IsNotEmpty({ message: 'The category_id field cannot be empty.' })
    category_id: string;
}
