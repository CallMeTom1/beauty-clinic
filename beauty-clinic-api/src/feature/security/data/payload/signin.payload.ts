import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsEmail } from 'class-validator';
import { ApiCodeResponse } from '@common/api';

export class SignInPayload {
    @ApiProperty({ description: 'Email address of the user' })
    @IsNotEmpty({ message: ApiCodeResponse.SIGNIN_PAYLOAD_MAIL_IS_EMPTY })
    @IsEmail({}, { message: ApiCodeResponse.SIGNIN_PAYLOAD_MAIL_IS_NOT_VALID })
    mail: string;

    @ApiProperty({ description: 'Password of the user' })
    @IsNotEmpty({ message: ApiCodeResponse.SIGNIN_PAYLOAD_PASSWORD_IS_EMPTY })
    @IsString({ message: ApiCodeResponse.SIGNIN_PAYLOAD_PASSWORD_IS_NOT_STRING })
    password: string;

    @ApiProperty({ description: 'Google OAuth hash', required: false })
    @IsOptional()
    @IsString({ message: ApiCodeResponse.SIGNIN_PAYLOAD_GOOGLE_HASH_IS_NOT_STRING })
    googleHash?: string;

}