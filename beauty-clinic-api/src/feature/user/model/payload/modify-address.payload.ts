import {ApiProperty} from "@nestjs/swagger";
import {IsBoolean, IsOptional, IsString} from "class-validator";

export class ModifyAddressPayload {
    @ApiProperty({ description: "ID de l'adresse à modifier" })
    @IsString()
    addressId: string;

    @ApiProperty({
        description: "Prénom pour l'adresse",
        example: "John"
    })
    @IsString()
    firstname: string;

    @ApiProperty({
        description: "Nom pour l'adresse",
        example: "Doe"
    })
    @IsString()
    lastname: string;

    @ApiProperty({
        description: "Rue",
        example: "Rue de Rivoli"
    })
    @IsString()
    road: string;

    @ApiProperty({
        description: "Numéro",
        example: "10"
    })
    @IsString()
    nb: string;

    @ApiProperty({
        description: "Code postal",
        example: "75001"
    })
    @IsString()
    cp: string;

    @ApiProperty({
        description: "Ville",
        example: "Paris"
    })
    @IsString()
    town: string;

    @ApiProperty({
        description: "Pays",
        example: "France"
    })
    @IsString()
    country: string;

    @ApiProperty({
        description: "Complément d'adresse",
        required: false
    })
    @IsOptional()
    @IsString()
    complement?: string;

    @ApiProperty({
        description: "Label de l'adresse",
        example: "Domicile"
    })
    @IsString()
    label: string;

    @ApiProperty({
        description: "Adresse par défaut",
        default: false
    })
    @IsBoolean()
    isDefault: boolean;

    @ApiProperty({
        description: "flag Adresse de livraison",
        default: false
    })
    @IsBoolean()
    isShippingAddress: boolean;

    @ApiProperty({
        description: "flag adresse de facturation",
        default: false
    })
    @IsBoolean()
    isBillingAddress: boolean;
}