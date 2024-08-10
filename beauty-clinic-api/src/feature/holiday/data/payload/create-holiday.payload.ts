// create-holiday.dto.ts
import {IsDate, IsNotEmpty} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateHolidayPayload {

    @ApiProperty({
        description: 'The date of the holiday in YYYY-MM-DD format.',
        example: '2024-12-25',
    })
    @IsDate()
    @IsNotEmpty({ message: 'The holiday_date is required.' })
    holiday_date: Date;
}
