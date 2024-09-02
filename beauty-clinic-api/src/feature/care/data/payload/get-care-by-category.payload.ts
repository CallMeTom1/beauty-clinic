import { ApiProperty } from '@nestjs/swagger';
import {IsEnum, IsNotEmpty, IsString} from 'class-validator';
import {CareCategory} from "@feature/care/enum/care-category.enum";

export class GetCaresByCategoryPayload {
    @ApiProperty({ description: 'Category of the care', enum: CareCategory })
    @IsNotEmpty({ message: 'category is required' })
    @IsEnum(CareCategory, { message: 'category must be a valid CareCategory value' })
    category: CareCategory;
}
