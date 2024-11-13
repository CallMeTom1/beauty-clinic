import { ApiProperty } from '@nestjs/swagger';

export class ModifyUserPayload {
    @ApiProperty({
        description: "nom d'utilisateur",
        example: "John",
        required: false
    })
    username?: string;

    @ApiProperty({
        description: "Prénom de l'utilisateur",
        example: "John",
        required: false
    })
    firstname?: string;

    @ApiProperty({
        description: "Nom de famille de l'utilisateur",
        example: "Doe",
        required: false
    })
    lastname?: string;

    @ApiProperty({
        description: "Numéro de téléphone de l'utilisateur",
        example: "+33123456789",
        required: false
    })
    phonenumber?: string;

}
