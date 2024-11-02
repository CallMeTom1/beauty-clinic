import {ApiProperty} from "@nestjs/swagger";
import {IsOptional, IsString} from "class-validator";

export class UpdateShippingAddressPayload {
    @ApiProperty()
    idOrder: string;

    @IsOptional()
    @IsString()
    firstname?: string;

    @IsOptional()
    @IsString()
    lastname?: string;

    @ApiProperty()
    road: string;

    @ApiProperty()
    nb: string;

    @ApiProperty()
    cp: string;

    @ApiProperty()
    town: string;

    @ApiProperty()
    country: string;

    @ApiProperty({ required: false })
    complement?: string;
}