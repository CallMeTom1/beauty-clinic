import { IsNotEmpty, IsString } from 'class-validator';

export class AppointmentIdPayload {
    @IsString()
    @IsNotEmpty()
    care_id: string;
}
