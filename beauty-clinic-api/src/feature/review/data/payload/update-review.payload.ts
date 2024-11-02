import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min} from "class-validator";

export class UpdateReviewPayload {
    @ApiProperty({
        description: 'ID de la review à modifier',
        example: '123e4567-e89b-12d3-a456-426614174003'
    })
    @IsNotEmpty()
    @IsString()
    review_id: string;

    @ApiProperty({
        description: 'Nouvelle note (optionnel)',
        minimum: 1,
        maximum: 5,
        required: false,
        example: 5
    })
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(5)
    rating?: number;

    @ApiProperty({
        description: 'Nouveau commentaire (optionnel)',
        required: false,
        maxLength: 1000,
        example: 'Après plusieurs utilisations, je confirme la qualité du produit !'
    })
    @IsOptional()
    @IsString()
    comment?: string;
}