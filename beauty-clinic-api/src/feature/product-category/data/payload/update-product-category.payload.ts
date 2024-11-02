import { ApiProperty } from '@nestjs/swagger';
import {IsString, IsNotEmpty, IsBoolean} from 'class-validator';

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

    @ApiProperty({
        description: 'boolean to publish or unpublish the product.',
        example: 'true'
    })
    @IsBoolean({ message: 'The isPublished must be a boolean.' })
    @IsNotEmpty({ message: 'The isPublished field cannot be empty.' })
    isPublished: boolean;

    @ApiProperty({
        description: 'Name of the product category.',
        example: 'Skincare'
    })
    @IsString({ message: 'The description must be a string.' })
    description: string;

}
