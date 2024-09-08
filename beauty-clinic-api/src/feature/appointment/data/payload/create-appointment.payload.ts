import { IsEnum, IsNotEmpty, IsString, IsDateString } from 'class-validator';
import { AppointmentStatus } from '../appointment-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAppointmentPayload {
    @ApiProperty({
        description: 'Unique identifier of the care associated with the appointment.',
        example: 'care_12345'
    })
    @IsString({ message: 'The care_id must be a string.' })
    @IsNotEmpty({ message: 'The care_id field cannot be empty.' })
    care_id: string;

    @ApiProperty({
        description: 'The start time of the appointment in ISO 8601 format.',
        example: '2024-08-10T14:30:00Z'
    })
    @IsDateString()
    @IsNotEmpty({ message: 'The start_time field cannot be empty.' })
    start_time: string;

}
