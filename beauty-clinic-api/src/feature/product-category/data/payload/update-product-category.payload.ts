import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateProductCategoryPayload {
    @ApiProperty({
        description: 'Unique identifier of the product category to update.',
        example: 'cat_12345'
    })
    @IsString({ message: 'The id must be a string.' })
    @IsNotEmpty({ message: 'The id field cannot be empty.' })
    id: string;

    @ApiProperty({
        description: 'New name for the product category.',
        example: 'Updated Skincare'
    })
    @IsString({ message: 'The name must be a string.' })
    @IsNotEmpty({ message: 'The name field cannot be empty.' })
    name: string;
}
