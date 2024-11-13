import {IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class DeleteAddressPayload {
    @ApiProperty({ description: "ID de l'adresse à supprimer" })
    addressId: string;
}