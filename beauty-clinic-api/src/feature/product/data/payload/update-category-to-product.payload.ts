import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, ArrayUnique, IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateProductCategoriesPayload {
    @ApiProperty({
        description: 'ID of the product.',
        example: 'prod_12345'
    })
    @IsString({ message: 'The product_id must be a string.' })
    @IsNotEmpty({ message: 'The product_id field cannot be empty.' })  // Remplacement de ArrayNotEmpty par IsNotEmpty
    product_id: string;

    @ApiProperty({
        description: 'List of category IDs to associate with the product. Can be empty to remove all categories.',
        example: ['cat_12345', 'cat_67890']
    })
    @IsArray({ message: 'The category_ids must be an array of strings.' })
    @ArrayUnique({ message: 'The category_ids must be unique.' })
    @IsOptional()
    category_ids: string[];
}
