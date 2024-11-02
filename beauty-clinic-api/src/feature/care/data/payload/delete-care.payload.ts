import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString} from "class-validator";

export class DeleteCarePayload {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    care_id: string;
}