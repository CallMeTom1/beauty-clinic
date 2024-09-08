
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateAppointmentNotePayload {
    @ApiProperty({
        description: 'Unique identifier of the appointment.',
        example: 'app_12345'
    })
    @IsString({ message: 'The appointment_id must be a string.' })
    @IsNotEmpty({ message: 'The appointment_id field cannot be empty.' })
    appointment_id: string;

    @ApiProperty({
        description: 'New note for the appointment.',
        example: 'Updated note for the appointment.'
    })
    @IsString({ message: 'The note must be a string.' })
    @IsNotEmpty({ message: 'The note field cannot be empty.' })
    note: string;
}
