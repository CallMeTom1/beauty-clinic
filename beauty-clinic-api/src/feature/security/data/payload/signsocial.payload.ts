import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, Length, Matches } from "class-validator";
import { ApiCodeResponse } from "@common/api";

export class SignsocialPayload {
    @ApiProperty({ description: 'Email address for the social sign-in', required: false })
    @IsOptional()
    @IsEmail({}, { message: ApiCodeResponse.SIGNUP_PAYLOAD_MAIL_IS_NOT_VALID })
    @Matches(/^[^\s<>]+$/, { message: ApiCodeResponse.SIGNUP_PAYLOAD_MAIL_INVALID_CHARACTERS })
    mail?: string;

    @ApiProperty({ description: 'Google OAuth hash' })
    @IsOptional()
    googleHash: string;

    @ApiProperty({ description: 'Facebook OAuth hash' })
    @IsOptional()
    facebookHash: string;
}