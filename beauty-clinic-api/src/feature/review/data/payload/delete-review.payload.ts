import {IsNotEmpty, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class DeleteReviewDto {
    @ApiProperty({
        description: 'ID de la review à supprimer',
        example: '123e4567-e89b-12d3-a456-426614174003'
    })
    @IsNotEmpty()
    @IsString()
    review_id: string;
}