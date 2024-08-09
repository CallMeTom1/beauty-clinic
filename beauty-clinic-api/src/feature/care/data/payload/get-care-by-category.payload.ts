import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetCaresByCategoryPayload {
    @ApiProperty({ description: 'Category of the care to be retrieved' })
    @IsNotEmpty({ message: 'category is required' })
    @IsString({ message: 'category must be a string' })
    category: string;
}
