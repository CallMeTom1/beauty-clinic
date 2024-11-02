import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsNotEmpty} from "class-validator";
import {ApiCodeResponse} from "@common/api";

export class ForgotPasswordPayload {
    @ApiProperty({ description: 'Email address of the user' })
    @IsNotEmpty({ message: ApiCodeResponse.PAYLOAD_PASSWORD_IS_EMPTY })
    @IsEmail({}, { message: ApiCodeResponse.PAYLOAD_PASSWORD_IS_EMPTY })
    email: string;
}