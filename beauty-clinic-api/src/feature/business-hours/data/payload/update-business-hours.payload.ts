import { IsBoolean, IsISO8601, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DayOfWeekEnum } from '../day-of-week.enum';

export class UpdateBusinessHoursPayload {

    @ApiProperty({
        description: 'The day of the week for which these business hours apply.',
        example: DayOfWeekEnum.MONDAY,
        required: false
    })
    @IsOptional()
    @IsEnum(DayOfWeekEnum, { message: 'The day_of_week must be a valid day of the week.' })
    day_of_week?: DayOfWeekEnum;

    @ApiProperty({
        description: 'The updated opening time of the business on this day in ISO 8601 format.',
        example: '1970-01-01T09:00:00Z',
        required: false
    })
    @IsOptional()
    @IsISO8601({}, { message: 'The opening_time must be a valid ISO 8601 date string.' })
    opening_time?: string;

    @ApiProperty({
        description: 'The updated closing time of the business on this day in ISO 8601 format.',
        example: '1970-01-01T20:00:00Z',
        required: false
    })
    @IsOptional()
    @IsISO8601({}, { message: 'The closing_time must be a valid ISO 8601 date string.' })
    closing_time?: string;

    @ApiProperty({
        description: 'Indicates whether the business is open on this day.',
        example: true,
        required: false
    })
    @IsOptional()
    @IsBoolean({ message: 'The is_open must be a boolean.' })
    is_open?: boolean;
}
