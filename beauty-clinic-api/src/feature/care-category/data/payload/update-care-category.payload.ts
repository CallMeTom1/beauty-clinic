import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {IsBoolean, IsNotEmpty, IsOptional, IsString} from "class-validator";

export class UpdateCareCategoryPayload {
    @ApiProperty({
        description: 'The unique identifier of the category to update',
        example: 'cat_massage2024'
    })
    @IsString()
    @IsNotEmpty()
    category_id: string;

    @ApiPropertyOptional({
        description: 'The new name for the category',
        example: 'Massages thérapeutiques'
    })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({
        description: 'The description of the category',
        example: 'Massages'
    })
    @IsString()
    @IsOptional()
    description: string;

    @ApiPropertyOptional({
        description: 'The new published status',
        example: true
    })
    @IsBoolean()
    @IsOptional()
    isPublished?: boolean;

    @ApiPropertyOptional({
        description: 'IDs of sub-categories to add',
        example: ['sub_cat_123', 'sub_cat_456'],
        type: [String]
    })
    @IsString({ each: true })
    @IsOptional()
    subCategoryIds?: string[];
}