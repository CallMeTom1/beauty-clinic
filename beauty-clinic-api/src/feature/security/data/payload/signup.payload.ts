import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, Length, Matches } from "class-validator";
import { ApiCodeResponse } from "@common/api";

export class SignupPayload {

    @ApiProperty({ description: 'Password for the sign-up' })
    @IsNotEmpty({ message: ApiCodeResponse.SIGNUP_PAYLOAD_PASSWORD_IS_EMPTY })
    @Length(1, 25, { message: ApiCodeResponse.SIGNUP_PAYLOAD_PASSWORD_LENGTH_INVALID })
    @Matches(/^[^\s<>]+$/, { message: ApiCodeResponse.SIGNUP_PAYLOAD_PASSWORD_INVALID_CHARACTERS })
    password: string;

    @ApiProperty({ description: 'Email address of the user' })
    @IsNotEmpty({ message: ApiCodeResponse.SIGNUP_PAYLOAD_MAIL_IS_EMPTY })
    @IsEmail({}, { message: ApiCodeResponse.SIGNUP_PAYLOAD_MAIL_IS_NOT_VALID })
    @Matches(/^[^\s<>]+$/, { message: ApiCodeResponse.SIGNUP_PAYLOAD_MAIL_INVALID_CHARACTERS })
    mail: string;

}