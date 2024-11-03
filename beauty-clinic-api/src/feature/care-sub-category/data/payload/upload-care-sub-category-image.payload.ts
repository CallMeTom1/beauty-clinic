import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

export class UploadCareSubCategoryImagePayload {
    @ApiProperty({
        description: 'The UUID of the care sub cat.',
        type: 'string',
        example: 'e8b0d37b-54d1-4b7a-9b9a-3bde5db7b524'
    })
    @IsNotEmpty({ message: 'The sub category id cannot be empty.' })
    sub_category_id: string;

    @ApiProperty({type: 'string', format: 'binary'})
        // Changez le nom pour correspondre au FileInterceptor
    categoryImage: any;
}