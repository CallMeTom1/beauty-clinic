import {ApiProperty} from "@nestjs/swagger";

export class UpdateOrderStatusPayload {
    @ApiProperty()
    idOrder: string;

    @ApiProperty()
    status: string;
}