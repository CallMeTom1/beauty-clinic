import {ApiProperty} from "@nestjs/swagger";
import {IsOptional, IsString, MaxLength, MinLength} from "class-validator";

export class CreateCareMachinePayload {
    @ApiProperty({
        description: 'Nom de la machine',
        example: 'LPG Alliance',
        minLength: 3,
        maxLength: 100
    })
    @IsString()
    @MinLength(3)
    @MaxLength(100)
    name: string;

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