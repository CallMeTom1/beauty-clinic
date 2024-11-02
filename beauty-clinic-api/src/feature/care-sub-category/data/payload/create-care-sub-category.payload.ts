import {IsBoolean, IsNotEmpty, IsOptional, IsString} from "class-validator";
import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";

export class CreateCareSubCategoryPayload {
    @ApiProperty({
        description: 'The name of the sub-category',
        example: 'Massages'
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'The description of the sub-category',
        example: 'Massages'
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({
        description: 'Whether the sub-category is published or not',
        default: false
    })
    @IsBoolean()
    @IsOptional()
    isPublished?: boolean;
}