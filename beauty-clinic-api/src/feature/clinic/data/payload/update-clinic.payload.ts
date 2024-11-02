import { IsString, IsOptional, IsEmail, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Address } from '@common/model/address.entity';

export class UpdateClinicPayload {
    @ApiProperty({ required: true })
    @IsString()
    clinic_id: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    address?: Address;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    phone_number?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsEmail()
    mail?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUrl()
    facebook_url?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUrl()
    instagram_url?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUrl()
    tiktok_url?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUrl()
    linkedin_url?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    clinic_logo?: string;
}