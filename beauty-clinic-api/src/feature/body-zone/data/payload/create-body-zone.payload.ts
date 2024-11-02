import {IsNotEmpty, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateBodyZonePayload {
    @ApiProperty({
        description: 'The name of the body zone',
        example: 'Visage'
    })
    @IsString()
    @IsNotEmpty()
    name: string;
}