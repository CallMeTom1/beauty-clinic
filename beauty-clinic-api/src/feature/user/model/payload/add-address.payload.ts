import {ApiProperty} from "@nestjs/swagger";
import {IsBoolean, IsNotEmpty, IsOptional, IsString, Length, Matches} from "class-validator";
import {ApiCodeResponse} from "@common/api";

export class AddAddressPayload {
    @ApiProperty({
        description: "Prénom pour l'adresse",
        example: "John"
    })
    @IsNotEmpty({ message: ApiCodeResponse.ADDRESS_FIRSTNAME_EMPTY })
    @Length(2, 50, { message: ApiCodeResponse.ADDRESS_FIRSTNAME_LENGTH })
    firstname: string;

    @ApiProperty({
        description: "Nom pour l'adresse",
        example: "Doe"
    })
    @IsNotEmpty({ message: ApiCodeResponse.ADDRESS_LASTNAME_EMPTY })
    @Length(2, 50, { message: ApiCodeResponse.ADDRESS_LASTNAME_LENGTH })
    lastname: string;

    @ApiProperty({
        description: "Rue",
        example: "Rue de Rivoli"
    })
    @IsNotEmpty({ message: ApiCodeResponse.ADDRESS_ROAD_EMPTY })
    @Length(2, 50, { message: ApiCodeResponse.ADDRESS_ROAD_LENGTH })
    road: string;

    @ApiProperty({
        description: "Numéro",
        example: "10"
    })
    @IsNotEmpty({ message: ApiCodeResponse.ADDRESS_NUMBER_EMPTY })
    @Length(1, 8, { message: ApiCodeResponse.ADDRESS_NUMBER_LENGTH })
    nb: string;

    @ApiProperty({
        description: "Code postal",
        example: "75001"
    })
    @IsNotEmpty({ message: ApiCodeResponse.ADDRESS_POSTAL_CODE_EMPTY })
    @Length(4, 10, { message: ApiCodeResponse.ADDRESS_POSTAL_CODE_LENGTH })
    cp: string;

    @ApiProperty({
        description: "Ville",
        example: "Paris"
    })
    @IsNotEmpty({ message: ApiCodeResponse.ADDRESS_TOWN_EMPTY })
    @Length(2, 50, { message: ApiCodeResponse.ADDRESS_TOWN_LENGTH })
    town: string;

    @ApiProperty({
        description: "Pays",
        example: "France"
    })
    @IsNotEmpty({ message: ApiCodeResponse.ADDRESS_COUNTRY_EMPTY })
    @Length(2, 50, { message: ApiCodeResponse.ADDRESS_COUNTRY_LENGTH })
    country: string;

    @ApiProperty({
        description: "Complément d'adresse",
        required: false
    })
    @IsOptional()
    complement?: string;

    @ApiProperty({
        description: "Label de l'adresse",
        example: "Domicile"
    })
    @IsNotEmpty({ message: ApiCodeResponse.ADDRESS_LABEL_EMPTY })
    @Length(2, 50, { message: ApiCodeResponse.ADDRESS_LABEL_LENGTH })
    label: string;

    @ApiProperty({
        description: "Adresse par défaut",
        default: false
    })
    isDefault: boolean;

    @ApiProperty({
        description: "Adresse de livraison",
        default: true
    })
    isShippingAddress: boolean;

    @ApiProperty({
        description: "Adresse de facturation",
        default: false
    })
    isBillingAddress: boolean;
}