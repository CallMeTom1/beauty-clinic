import { ApiProperty } from '@nestjs/swagger';
import {IsString} from "class-validator";

export class CreateHolidayIntervalPayload {
    @ApiProperty({ example: '2023-01-01', description: 'Start date of the holiday interval (inclusive)' })
    @IsString({message: 'The start_date must be a string'})
    start_date: string;  // Date de début au format ISO (YYYY-MM-DD)

    @IsString({message: 'The end_date must be a string'})
    @ApiProperty({ example: '2023-01-07', description: 'End date of the holiday interval (inclusive)' })
    end_date: string;    // Date de fin au format ISO (YYYY-MM-DD)
}
