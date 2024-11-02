import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UploadClinicLogoPayload {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    clinicId: string;
}