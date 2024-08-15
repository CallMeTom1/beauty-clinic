import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive, Min, IsString, MaxLength } from 'class-validator';

export class GetCaresPaginatedPayload {
    @ApiProperty({
        description: 'The page number starting from 1',
        example: 1,
        minimum: 1
    })
    @IsInt({ message: 'Page must be an integer' })
    @IsPositive({ message: 'Page must be a positive integer' })
    @Min(1, { message: 'Page must be at least 1' })
    page: number;

    @ApiProperty({
        description: 'The number of items per page',
        example: 10,
        minimum: 1,
        maximum: 100
    })
    @IsInt({ message: 'Limit must be an integer' })
    @Min(1, { message: 'Limit must be at least 1' })
    @IsPositive({ message: 'Limit must be a positive integer' })
    limit: number;

    @ApiProperty({
        description: 'Filter by category',
        required: false,
        example: 'Skin Care',
        type: String
    })
    @IsOptional()
    @IsString({ message: 'Category must be a string' })
    @MaxLength(50, { message: 'Category must be 50 characters or fewer' })
    category?: string;
}
