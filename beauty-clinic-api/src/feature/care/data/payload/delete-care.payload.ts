import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteCarePayload {
    @ApiProperty({ description: 'Unique identifier of the care to be deleted' })
    @IsNotEmpty({ message: 'care_id is required' })
    @IsString({ message: 'care_id must be a string' })
    care_id: string;
}
