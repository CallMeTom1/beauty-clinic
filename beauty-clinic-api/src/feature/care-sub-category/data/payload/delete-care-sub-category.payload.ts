import {IsNotEmpty, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class DeleteCareSubCategoryPayload {
    @ApiProperty({
        description: 'The unique identifier of the sub-category to delete',
        example: 'cat_massage2024'
    })
    @IsString()
    @IsNotEmpty()
    sub_category_id: string;
}