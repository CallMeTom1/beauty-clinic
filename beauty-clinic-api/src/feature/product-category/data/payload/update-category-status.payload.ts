import { ApiProperty } from "@nestjs/swagger";
import { IsUUID, IsNotEmpty } from "class-validator";

export class UpdateCategoryStatusPayload {
    @ApiProperty({
        description: 'The ULID of the category to update.',
        example: 'e8b0d37b-54d1-4b7a-9b9a-3bde5db7b524',
        type: 'string'
    })
    @IsNotEmpty({ message: 'The id cannot be empty.' })
    id: string;
}
