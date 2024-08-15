import { IsEnum, IsNotEmpty, IsString, IsDateString } from 'class-validator';
import { CareStatus } from '../status.enum';
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

    @ApiProperty({
        description: 'The end time of the appointment in ISO 8601 format.',
        example: '2024-08-10T15:30:00Z'
    })
    @IsDateString()
    @IsNotEmpty({ message: 'The end_time field cannot be empty.' })
    end_time: string;
    @ApiProperty({
        description: 'The status of the appointment, indicating if it is confirmed, pending, or another status.',
        example: CareStatus.CONFIRMED
    })
    @IsEnum(CareStatus, { message: 'The status must be a valid CareStatus enum value.' })
    @IsNotEmpty({ message: 'The status field cannot be empty.' })
    status: CareStatus;

    @ApiProperty({
        description: 'Additional notes or comments for the appointment.',
        example: 'Patient requested extra time for discussion.'
    })
    @IsString({ message: 'The notes must be a string.' })
    @IsNotEmpty({ message: 'The notes field cannot be empty.' })
    notes: string;
}
