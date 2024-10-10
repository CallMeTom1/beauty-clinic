import { ApiProperty } from '@nestjs/swagger';
import {IsString, IsNumber, IsOptional, IsNotEmpty} from 'class-validator';

export class UpdateProductPayload {
    @ApiProperty({
        description: 'Unique identifier of the product category to update.',
        example: 'cat_12345'
    })
    @IsString({ message: 'The id must be a string.' })
    @IsNotEmpty({ message: 'The id field cannot be empty.' })
    id: string;

    @ApiProperty({
        description: 'Name of the product.',
        example: 'Updated anti-aging cream',
        required: false
    })
    @IsString({ message: 'The name must be a string.' })
    @IsOptional()
    name?: string;

    @ApiProperty({
        description: 'Description of the product.',
        example: 'Updated description for the product.',
        required: false
    })
    @IsString({ message: 'The description must be a string.' })
    @IsOptional()
    description?: string;

    @ApiProperty({
        description: 'Price of the product.',
        example: 29.99,
        required: false
    })
    @IsNumber({}, { message: 'The price must be a number.' })
    @IsOptional()
    price?: number;

    @ApiProperty({
        description: 'Quantity stored of the product.',
        example: 100,
        required: false
    })
    @IsNumber({}, { message: 'The quantity_stored must be a number.' })
    @IsOptional()
    quantity_stored?: number;

    @ApiProperty({
        description: 'Promo percentage for the product.',
        example: 10,
        required: false
    })
    @IsNumber({}, { message: 'The promo_percentage must be a number.' })
    @IsOptional()
    promo_percentage?: number;

}
