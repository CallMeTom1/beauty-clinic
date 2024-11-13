import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min} from "class-validator";

export class CreateReviewPayload {
    @ApiProperty({
        description: 'Note donnée par l\'utilisateur',
        minimum: 1,
        maximum: 5,
        example: 4
    })
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(5)
    rating: number;

    @ApiProperty({
        description: 'Commentaire de l\'utilisateur',
        required: false,
        maxLength: 1000,
        example: 'Excellent produit, je recommande !'
    })
    @IsOptional()
    @IsString()
    comment?: string;

    @ApiProperty({
        description: 'ID du produit concerné par la review (optionnel si review pour un soin)',
        required: false,
        example: '123e4567-e89b-12d3-a456-426614174001'
    })
    @IsOptional()
    @IsString()
    product_id?: string;

    @ApiProperty({
        description: 'ID du soin concerné par la review (optionnel si review pour un produit)',
        required: false,
        example: '123e4567-e89b-12d3-a456-426614174002'
    })
    @IsOptional()
    @IsString()
    care_id?: string;
}