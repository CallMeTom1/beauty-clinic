import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, Length, Matches } from "class-validator";
import { ApiCodeResponse } from "@common/api";

export class SignupPayload {

    @ApiProperty({ description: 'Password for the sign-up' })
    @IsNotEmpty({ message: ApiCodeResponse.SIGNUP_PAYLOAD_PASSWORD_IS_EMPTY })
    @Length(1, 25, { message: ApiCodeResponse.SIGNUP_PAYLOAD_PASSWORD_LENGTH_INVALID })
    @Matches(/^[^\s<>]+$/, { message: ApiCodeResponse.SIGNUP_PAYLOAD_PASSWORD_INVALID_CHARACTERS })
    password: string;

    @ApiProperty({ description: 'Phone number for the sign-up', required: false })
    @Length(1, 25, { message: ApiCodeResponse.SIGNUP_PAYLOAD_PHONE_NUMBER_LENGTH_INVALID })
    phoneNumber: string;

    @ApiProperty({ description: 'First name of the user', required: false })
    @Length(1, 25, { message: ApiCodeResponse.SIGNUP_PAYLOAD_FIRSTNAME_LENGTH_INVALID })
    @Matches(/^[^\s<>]+$/, { message: ApiCodeResponse.SIGNUP_PAYLOAD_FIRSTNAME_INVALID_CHARACTERS })
    firstname: string;

    @ApiProperty({ description: 'Last name of the user', required: false })
    @Length(1, 25, { message: ApiCodeResponse.SIGNUP_PAYLOAD_LASTNAME_LENGTH_INVALID })
    @Matches(/^[^\s<>]+$/, { message: ApiCodeResponse.SIGNUP_PAYLOAD_LASTNAME_INVALID_CHARACTERS })
    lastname: string;

    @ApiProperty({ description: 'Email address of the user' })
    @IsNotEmpty({ message: ApiCodeResponse.SIGNUP_PAYLOAD_MAIL_IS_EMPTY })
    @IsEmail({}, { message: ApiCodeResponse.SIGNUP_PAYLOAD_MAIL_IS_NOT_VALID })
    @Matches(/^[^\s<>]+$/, { message: ApiCodeResponse.SIGNUP_PAYLOAD_MAIL_INVALID_CHARACTERS })
    mail: string;

    @ApiProperty({ description: 'Google OAuth hash' })
    @IsOptional()
    @Matches(/^[^\s<>]+$/, { message: ApiCodeResponse.SIGNUP_PAYLOAD_GOOGLE_HASH_INVALID_CHARACTERS })
    googleHash?: string;

    @ApiProperty({ description: 'Facebook OAuth hash' })
    @IsOptional()
    @Matches(/^[^\s<>]+$/, { message: ApiCodeResponse.SIGNUP_PAYLOAD_FACEBOOK_HASH_INVALID_CHARACTERS })
    facebookHash?: string;
}