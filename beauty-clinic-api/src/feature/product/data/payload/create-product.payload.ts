import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateProductPayload {
    @ApiProperty({
        description: 'Name of the product.',
        example: 'Anti-aging cream'
    })
    @IsString({ message: 'The name must be a string.' })
    @IsNotEmpty({ message: 'The name field cannot be empty.' })
    name: string;

    @ApiProperty({
        description: 'Description of the product.',
        example: 'A cream that reduces the appearance of wrinkles.'
    })
    @IsString({ message: 'The description must be a string.' })
    @IsNotEmpty({ message: 'The description field cannot be empty.' })
    description: string;

    @ApiProperty({
        description: 'Price of the product.',
        example: 29.99
    })
    @IsNumber({}, { message: 'The price must be a number.' })
    @IsNotEmpty({ message: 'The price field cannot be empty.' })
    price: number;

    @ApiProperty({
        description: 'Quantity stored of the product.',
        example: 100
    })
    @IsNumber({}, { message: 'The quantity_stored must be a number.' })
    @IsNotEmpty({ message: 'The quantity_stored field cannot be empty.' })
    quantity_stored: number;

    @ApiProperty({
        description: 'Promo percentage for the product.',
        example: 10,
        required: false
    })
    @IsNumber({}, { message: 'The promo_percentage must be a number.' })
    @IsOptional()
    promo_percentage?: number;

}
