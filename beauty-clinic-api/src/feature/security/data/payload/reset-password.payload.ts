import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsNotEmpty, IsString} from "class-validator";
import {ApiCodeResponse} from "@common/api";

export class ResetPasswordPayload {
    @ApiProperty({ description: 'token' })
    @IsNotEmpty({ message: ApiCodeResponse.SIGNIN_PAYLOAD_MAIL_IS_EMPTY })
    @IsString({})
    token: string;

    @ApiProperty({ description: 'new password' })
    @IsNotEmpty({ message: ApiCodeResponse.SIGNIN_PAYLOAD_MAIL_IS_EMPTY })
    @IsString({})
    newPassword: string;
}