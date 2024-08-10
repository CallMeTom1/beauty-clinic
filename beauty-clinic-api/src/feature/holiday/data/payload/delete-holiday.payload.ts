// create-holiday.dto.ts
import {IsDate, IsNotEmpty, IsString} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteHolidayPayload {
    @ApiProperty({
        description: 'The date of the holiday in YYYY-MM-DD format.',
        example: '2024-12-25',
    })
    @IsString({message: 'The holiday_date must be a string'})
    @IsNotEmpty({ message: 'The holiday_date is required.' })
    holiday_date: string;
}
