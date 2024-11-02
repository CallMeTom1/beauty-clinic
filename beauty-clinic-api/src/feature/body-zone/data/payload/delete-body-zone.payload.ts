import {IsNotEmpty, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class DeleteBodyZonePayload {
    @ApiProperty({
        description: 'The ID of the body zone to delete',
        example: 'zone_123'
    })
    @IsString()
    @IsNotEmpty()
    body_zone_id: string;
}