import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAppointmentStatusPayload {
    @ApiProperty({ description: 'The ID of the appointment to update' })
    @IsString()
    @IsNotEmpty({ message: 'Appointment ID is required' })
    appointment_id: string;
}
