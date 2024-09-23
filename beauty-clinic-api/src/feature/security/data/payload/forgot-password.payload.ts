import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsNotEmpty} from "class-validator";
import {ApiCodeResponse} from "@common/api";

export class ForgotPasswordPayload {
    @ApiProperty({ description: 'Email address of the user' })
    @IsNotEmpty({ message: ApiCodeResponse.SIGNIN_PAYLOAD_MAIL_IS_EMPTY })
    @IsEmail({}, { message: ApiCodeResponse.SIGNIN_PAYLOAD_MAIL_IS_NOT_VALID })
    email: string;
}