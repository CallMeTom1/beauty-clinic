import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";
import {ApiCodeResponse} from "@common/api";

export class ChangePasswordPayload {

    @ApiProperty({ description: 'old password' })
    @IsNotEmpty({ message: ApiCodeResponse.PAYLOAD_PASSWORD_IS_EMPTY })
    oldPassword: string;

    @ApiProperty({ description: 'new password' })
    @IsNotEmpty({ message: ApiCodeResponse.PAYLOAD_PASSWORD_IS_EMPTY })
    newPassword: string;
}