import {ApiProperty} from "@nestjs/swagger";

export class UploadImagePayload{
    @ApiProperty({type: 'string', format: 'binary'})
    profileImage: any;
}