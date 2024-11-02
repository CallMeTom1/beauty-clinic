
import {IsNumber, IsString, Min, IsPositive, IsBoolean} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateShippingFeePayload {
    @ApiProperty({
        description: 'Montant des frais de livraison',
        example: 5.99
    })
    @IsNumber()
    @IsPositive()
    amount: number;

    @ApiProperty({
        description: 'Montant minimum pour la livraison gratuite',
        example: 50.00
    })
    @IsNumber()
    @IsPositive()
    freeShippingThreshold: number;

    @ApiProperty({
        description: 'Description des conditions de livraison',
        example: 'Livraison gratuite à partir de 50€ d\'achat'
    })
    @IsString()
    description: string;

}