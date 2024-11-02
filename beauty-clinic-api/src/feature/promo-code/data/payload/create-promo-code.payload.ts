import {IsBoolean, IsDate, IsNumber, IsString, Max, Min} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {Type} from "class-transformer";

export class CreatePromoCodePayload {
    @ApiProperty({
        description: 'Code promo unique',
        example: 'SUMMER30'
    })
    @IsString()
    code: string;

    @ApiProperty({
        description: 'Pourcentage de réduction',
        example: 30.00,
        minimum: 0,
        maximum: 100
    })
    @IsNumber()
    @Min(0)
    @Max(100)
    percentage: number;

    @ApiProperty({
        description: 'Nombre maximum d\'utilisations',
        example: 100
    })
    @IsNumber()
    @Min(1)
    maxUses: number;

    @ApiProperty({
        description: 'Date de début de validité',
        example: '2024-01-01T00:00:00Z'
    })
    @Type(() => Date)
    @IsDate()
    validFrom: Date;

    @ApiProperty({
        description: 'Date de fin de validité',
        example: '2024-12-31T23:59:59Z'
    })
    @Type(() => Date)
    @IsDate()
    validTo: Date;

    @ApiProperty({
        description: 'is active',
        example: 'true'
    })
    @IsBoolean()
    isActive: boolean;
}