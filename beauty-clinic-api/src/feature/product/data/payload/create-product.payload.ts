import { ApiProperty } from '@nestjs/swagger';
import {IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean, IsArray} from 'class-validator';

export class CreateProductPayload {
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
    quantity_stored: number;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    minQuantity?: number;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    maxQuantity?: number;


    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    isPublished?: boolean;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    isPromo?: boolean;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    promo_percentage?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsArray()
    category_ids?: string[];
}

