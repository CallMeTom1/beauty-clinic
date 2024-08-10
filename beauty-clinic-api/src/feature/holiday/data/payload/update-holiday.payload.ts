// update-holiday.dto.ts
import { IsDateString, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateHolidayPayload {
    @ApiProperty({
        description: 'Unique identifier for the holiday entry to be updated.',
        example: 'holiday_12345',
    })
    @IsString({ message: 'The holiday_id must be a string.' })
    @IsOptional()
    holiday_id?: string;

    @ApiProperty({
        description: 'The updated date of the holiday in YYYY-MM-DD format.',
        example: '2024-12-26',
        required: false,
    })
    @IsDateString()
    @IsOptional()
    holiday_date?: string;
}
