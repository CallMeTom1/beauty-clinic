import {ApiProperty} from "@nestjs/swagger";
import {IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";

export class CreateCarePayload {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    initial_price: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    sessions: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    duration: number;

    @ApiProperty()
    @IsNumber()
    time_between: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    isPublished?: boolean;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
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