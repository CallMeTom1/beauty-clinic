import {IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class SetDefaultAddressPayload {
    @ApiProperty({ description: "ID de l'adresse à définir par défaut" })
    @IsString()
    addressId: string;
}