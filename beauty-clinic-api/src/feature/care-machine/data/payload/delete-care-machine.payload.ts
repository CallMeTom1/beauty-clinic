import {IsString, MaxLength, MinLength} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class DeleteCareMachinePayload {
    @ApiProperty({
        description: 'Identifiant unique de la machine à supprimer',
        example: '01HQ8FCDZ3FJ5Z6BQ0H6XB9A8P'
    })
    @IsString()
    @MinLength(26)
    @MaxLength(26)
    care_machine_id: string;
}