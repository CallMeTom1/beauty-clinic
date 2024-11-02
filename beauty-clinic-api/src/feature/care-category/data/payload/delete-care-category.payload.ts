import {IsNotEmpty, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class DeleteCareCategoryPayload {
    @ApiProperty({
        description: 'The unique identifier of the category to delete',
        example: 'cat_massage2024'
    })
    @IsString()
    @IsNotEmpty()
    sub_category_id: string;
}