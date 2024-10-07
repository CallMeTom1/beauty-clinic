import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString} from "class-validator";

export class RemoveProductPayload {
    @ApiProperty({
        description: 'Unique identifier of the product to remove.',
        example: 'ulid'
    })
    @IsString({ message: 'The id must be a string.' })
    @IsNotEmpty({ message: 'The id field cannot be empty.' })
    id: string;
}