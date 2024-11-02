import { ApiProperty } from "@nestjs/swagger";
import {OrderStatus} from "../../order-status.enum";

export class UpdateOrderStatusPayload {
    @ApiProperty()
    idOrder: string;

    @ApiProperty({ enum: OrderStatus })
    status: OrderStatus;
}