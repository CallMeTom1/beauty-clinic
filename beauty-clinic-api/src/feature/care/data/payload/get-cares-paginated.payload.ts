import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { CareCategory } from '@feature/care/enum/care-category.enum';

export class GetCaresPaginatedPayload {
    @ApiProperty({
        description: 'The page number starting from 1',
        example: 1,
        minimum: 1
    })
    @Type(() => Number)  // This ensures the query parameter is transformed to a number
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
    @Type(() => Number)  // This ensures the query parameter is transformed to a number
    @IsInt({ message: 'Limit must be an integer' })
    @Min(1, { message: 'Limit must be at least 1' })
    @IsPositive({ message: 'Limit must be a positive integer' })
    limit: number;

    @ApiProperty({
        description: 'Category of the care',
        enum: CareCategory,
        required: false
    })
    @IsOptional()
    @IsEnum(CareCategory, { message: 'category must be a valid CareCategory value' })
    category?: CareCategory;
}
