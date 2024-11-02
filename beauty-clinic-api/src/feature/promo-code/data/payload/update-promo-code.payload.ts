import {IsBoolean, IsDate, IsNumber, IsOptional, IsString, Max, Min} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {Type} from "class-transformer";

export class UpdatePromoCodePayload {
    @ApiProperty({
        description: 'id du code promo',
    })
    @IsString()
    promo_code_id: string;

    @ApiProperty({
        description: 'Pourcentage de réduction',
        example: 30.00,
        minimum: 0,
        maximum: 100,
        required: false
    })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(100)
    percentage?: number;

    @ApiProperty({
        description: 'Nombre maximum d\'utilisations',
        example: 100,
        required: false
    })
    @IsOptional()
    @IsNumber()
    @Min(1)
    maxUses?: number;

    @ApiProperty({
        description: 'Date de fin de validité',
        example: '2024-12-31T23:59:59Z',
        required: false
    })
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    validTo?: Date;

    @ApiProperty({
        description: 'is active',
        example: 'true'
    })
    @IsOptional()
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}