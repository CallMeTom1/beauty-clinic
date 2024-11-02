import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString} from "class-validator";
import {ApiCodeResponse} from "@common/api";

export class ResetPasswordPayload {
    @ApiProperty({ description: 'token' })
    @IsNotEmpty({ message: ApiCodeResponse.PAYLOAD_TOKEN_IS_EMPTY })
    @IsString({})
    token: string;

    @ApiProperty({ description: 'new password' })
    @IsNotEmpty({ message: ApiCodeResponse.PAYLOAD_PASSWORD_IS_EMPTY })
    @IsString({})
    newPassword: string;
}