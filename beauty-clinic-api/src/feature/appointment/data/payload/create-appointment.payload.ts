import { IsEnum, IsNotEmpty, IsString, IsDateString } from 'class-validator';
import { CareStatus } from '../status.enum';

export class CreateAppointmentPayload {
    @IsString()
    @IsNotEmpty()
    care_id: string;

    @IsDateString()
    @IsNotEmpty()
    start_time: string;

    @IsDateString()
    @IsNotEmpty()
    end_time: string;

    @IsEnum(CareStatus)
    @IsNotEmpty()
    status: CareStatus;

    @IsString()
    @IsNotEmpty()
    notes: string;
}
