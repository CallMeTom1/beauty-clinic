import { ApiProperty } from '@nestjs/swagger';
import {IsString, IsNotEmpty, IsBoolean, IsOptional} from 'class-validator';

export class CreateProductCategoryPayload {
    @ApiProperty({
        description: 'Name of the product category.',
        example: 'Skincare'
    })
    @IsString({ message: 'The name must be a string.' })
    @IsNotEmpty({ message: 'The name field cannot be empty.' })
    name: string;

    @ApiProperty({
        description: 'Name of the product category.',
        example: 'Skincare'
    })
    @IsString({ message: 'The description must be a string.' })
    @IsOptional()
    description?: string;

    @ApiProperty({
        description: 'boolean to publish or unpublish the product.',
        example: 'true'
    })
    @IsBoolean({ message: 'The isPublished must be a boolean.' })
    @IsOptional()
    isPublished?: boolean;
}
