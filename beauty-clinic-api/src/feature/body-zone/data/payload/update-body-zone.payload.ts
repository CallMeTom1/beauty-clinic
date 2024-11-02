import {IsNotEmpty, IsOptional, IsString} from "class-validator";
import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";

export class UpdateBodyZonePayload {
    @ApiProperty({
        description: 'The ID of the body zone to update',
        example: 'zone_123'
    })
    @IsString()
    @IsNotEmpty()
    body_zone_id: string;

    @ApiPropertyOptional({
        description: 'The new name of the body zone',
        example: 'Visage et cou'
    })
    @IsString()
    @IsOptional()
    name?: string;
}