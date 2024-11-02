import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, Length } from "class-validator";
import { ApiCodeResponse } from "@common/api";

export class SignupPayload {
    @ApiProperty()
    @IsNotEmpty({ message: ApiCodeResponse.SIGNUP_PAYLOAD_USERNAME_IS_EMPTY })
    @Length(2, 50, { message: ApiCodeResponse.SIGNUP_PAYLOAD_USERNAME_LENGTH_INVALID })
    username: string;

    @ApiProperty()
    @IsNotEmpty({ message: ApiCodeResponse.SIGNUP_PAYLOAD_FIRSTNAME_LENGTH_INVALID })
    @Length(2, 50, { message: ApiCodeResponse.SIGNUP_PAYLOAD_FIRSTNAME_LENGTH_INVALID })
    firstname: string;

    @ApiProperty()
    @IsNotEmpty({ message: ApiCodeResponse.SIGNUP_PAYLOAD_LASTNAME_LENGTH_INVALID })
    @Length(2, 50, { message: ApiCodeResponse.SIGNUP_PAYLOAD_LASTNAME_LENGTH_INVALID })
    lastname: string;

    @ApiProperty({ description: 'Email address of the user' })
    @IsNotEmpty({ message: ApiCodeResponse.SIGNUP_PAYLOAD_MAIL_IS_EMPTY })
    @IsEmail({}, { message: ApiCodeResponse.SIGNUP_PAYLOAD_MAIL_IS_NOT_VALID })
    mail: string;

    @ApiProperty({ description: 'Password for the sign-up' })
    @IsNotEmpty({ message: ApiCodeResponse.SIGNUP_PAYLOAD_PASSWORD_IS_EMPTY })
    @Length(1, 25, { message: ApiCodeResponse.SIGNUP_PAYLOAD_PASSWORD_LENGTH_INVALID })
    password: string;
}