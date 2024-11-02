import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString} from "class-validator";

export class UpdateTrackingNumberPayload {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    idOrder: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    trackingNumber: string;
}