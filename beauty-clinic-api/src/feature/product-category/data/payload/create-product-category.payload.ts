import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateProductCategoryPayload {
    @ApiProperty({
        description: 'Name of the product category.',
        example: 'Skincare'
    })
    @IsString({ message: 'The name must be a string.' })
    @IsNotEmpty({ message: 'The name field cannot be empty.' })
    name: string;
}
