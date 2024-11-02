import {ApiProperty} from "@nestjs/swagger";
import {IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min} from "class-validator";

export class UpdateCarePayload {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    care_id: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    initial_price?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    sessions?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    duration?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    time_between?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    isPublished?: boolean;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    is_promo?: boolean;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(100)
    promo_percentage?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsArray()
    category_ids?: string[];

    @ApiProperty({ required: false })
    @IsOptional()
    @IsArray()
    sub_category_ids?: string[];

    @ApiProperty({ required: false })
    @IsOptional()
    @IsArray()
    body_zone_ids?: string[];

    @ApiProperty({ required: false })
    @IsOptional()
    @IsArray()
    machine_ids?: string[];
}