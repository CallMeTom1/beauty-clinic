import { ApiProperty } from "@nestjs/swagger";
import {IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min} from "class-validator";
import {Transform} from "class-transformer";

export class UpdateProductPayload {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    product_id: string;

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
    quantity_stored?: number;

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

    @ApiProperty({ required: false, type: [String], description: 'Array of category IDs. Send empty array to remove all categories.' })
    @IsOptional()
    @IsArray()
    @Transform(({ value }) => {
        // Assure que la valeur est toujours un tableau, même si vide
        return Array.isArray(value) ? value : [];
    })
    category_ids?: string[];

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    is_promo?: boolean;

    @ApiProperty({ required: false, minimum: 0, maximum: 100 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(100)
    promo_percentage?: number;
}