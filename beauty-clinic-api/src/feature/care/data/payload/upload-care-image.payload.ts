import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

export class UploadCareImagePayload {
    @ApiProperty()
    @IsNotEmpty()
    careId: string;

    @ApiProperty({type: 'string', format: 'binary'})
    careImage: any;
}