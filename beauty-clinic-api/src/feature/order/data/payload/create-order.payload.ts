import {ApiProperty} from "@nestjs/swagger";

export class CreateOrderPayload {
    @ApiProperty()
    idCart: string;
}