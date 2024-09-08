import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty, IsPhoneNumber, IsDateString } from 'class-validator';

export class CreateAppointmentAdminUserDoesNotExistPayload {
    @ApiProperty({
        description: 'First name of the user',
        example: 'John',
    })
    @IsString({ message: 'First name must be a string' })
    @IsNotEmpty({ message: 'First name is required' })
    firstname: string;

    @ApiProperty({
        description: 'Last name of the user',
        example: 'Doe',
    })
    @IsString({ message: 'Last name must be a string' })
    @IsNotEmpty({ message: 'Last name is required' })
    lastname: string;

    @ApiProperty({
        description: 'Phone number of the user (optional)',
        example: '+1234567890',
        required: false,
    })
    @IsOptional()
    @IsPhoneNumber(null, { message: 'Phone number must be valid' })
    phoneNumber?: string;

    @ApiProperty({
        description: 'ID of the care service',
        example: '01F4A9YKVG2EJQPN2WZK09VCSH',
    })
    @IsString({ message: 'Care ID must be a string' })
    @IsNotEmpty({ message: 'Care ID is required' })
    care_id: string;

    @ApiProperty({
        description: 'Start time of the appointment (YYYY-MM-DD HH:mm:ss format)',
        example: '2024-07-10 14:00:00',
    })
    @IsString({ message: 'Start time must be a string' })
    start_time: string;
}
