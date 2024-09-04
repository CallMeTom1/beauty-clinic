import { IsBoolean, Matches, IsNotEmpty, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateBusinessHoursPayload {
    @ApiProperty({
        description: 'The updated opening time of the business on this day in HH:mm:ss format.',
        example: '09:00:00',
        required: true
    })
    @IsNotEmpty({ message: 'The opening_time is required.' })
    @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, { message: 'The opening_time must be a valid time string in HH:mm:ss format.' })
    @ValidateIf((o) => o.is_open === true)
    opening_time: string;

    @ApiProperty({
        description: 'The updated closing time of the business on this day in HH:mm:ss format.',
        example: '20:00:00',
        required: true
    })
    @IsNotEmpty({ message: 'The closing_time is required.' })
    @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, { message: 'The closing_time must be a valid time string in HH:mm:ss format.' })
    @ValidateIf((o) => o.is_open === true)
    closing_time: string;

    @ApiProperty({
        description: 'Indicates whether the business is open on this day.',
        example: true,
        required: true
    })
    @IsBoolean({ message: 'The is_open must be a boolean.' })
    @Type(() => Boolean)
    is_open: boolean;
}