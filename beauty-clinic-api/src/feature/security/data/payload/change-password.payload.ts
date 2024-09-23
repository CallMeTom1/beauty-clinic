import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsNotEmpty} from "class-validator";
import {ApiCodeResponse} from "@common/api";

export class ChangePasswordPayload {

    @ApiProperty({ description: 'old password' })
    @IsNotEmpty({ message: ApiCodeResponse.SIGNIN_PAYLOAD_MAIL_IS_EMPTY })
    @IsEmail({}, { message: ApiCodeResponse.SIGNIN_PAYLOAD_MAIL_IS_NOT_VALID })
    oldPassword: string;

    @ApiProperty({ description: 'new password' })
    @IsNotEmpty({ message: ApiCodeResponse.SIGNIN_PAYLOAD_MAIL_IS_EMPTY })
    @IsEmail({}, { message: ApiCodeResponse.SIGNIN_PAYLOAD_MAIL_IS_NOT_VALID })
    newPassword: string;
}