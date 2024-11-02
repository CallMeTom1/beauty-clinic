import {ApiProperty} from "@nestjs/swagger";
import {IsOptional, IsString, MaxLength, MinLength} from "class-validator";

export class UpdateCareMachinePayload {
    @ApiProperty({
        description: 'Identifiant unique de la machine',
        example: '01HQ8FCDZ3FJ5Z6BQ0H6XB9A8P'
    })
    @IsString()
    @MinLength(26)
    @MaxLength(26)
    care_machine_id: string;

    @ApiProperty({
        description: 'Nom de la machine',
        example: 'LPG Alliance',
        required: false
    })
    @IsString()
    @IsOptional()
    @MinLength(3)
    @MaxLength(100)
    name?: string;

    @ApiProperty({
        description: 'Description détaillée de la machine',
        example: 'Machine de dernière génération pour les soins minceur',
        required: false
    })
    @IsString()
    @IsOptional()
    @MaxLength(500)
    description?: string;
}