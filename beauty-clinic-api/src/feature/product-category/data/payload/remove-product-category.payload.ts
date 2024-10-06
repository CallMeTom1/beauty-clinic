import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class RemoveProductCategoryPayload {
    @ApiProperty({
        description: 'Unique identifier of the product category to remove.',
        example: 'cat_12345'
    })
    @IsString({ message: 'The id must be a string.' })
    @IsNotEmpty({ message: 'The id field cannot be empty.' })
    id: string;
}
