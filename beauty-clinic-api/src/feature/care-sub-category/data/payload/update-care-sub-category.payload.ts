import {IsBoolean, IsNotEmpty, IsOptional, IsString} from "class-validator";
import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";

export class UpdateCareSubCategoryPayload {
    @ApiProperty({
        description: 'The unique identifier of the sub-category to update',
        example: 'cat_massage2024'
    })
    @IsString()
    @IsNotEmpty()
    sub_category_id: string;

    @ApiPropertyOptional({
        description: 'The new name for the sub-category',
        example: 'Massages thérapeutiques'
    })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({
        description: 'The description of the sub-category',
        example: 'Massages'
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({
        description: 'The new published status',
        example: true
    })
    @IsBoolean()
    @IsOptional()
    isPublished?: boolean;
}