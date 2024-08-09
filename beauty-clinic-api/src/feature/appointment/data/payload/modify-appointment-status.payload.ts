import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { CareStatus } from '../status.enum';

export class UpdateAppointmentStatusPayload {
    @IsString()
    @IsNotEmpty()
    appointment_id: string;

    @IsEnum(CareStatus)
    @IsNotEmpty()
    status: CareStatus;
}
