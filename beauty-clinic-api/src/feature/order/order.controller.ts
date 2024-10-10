import { Controller, Post, Get, Patch, Param, Body } from '@nestjs/common';
import { OrderService } from './order.service';
import {User} from "@feature/user/model";
import {Roles, UserReq, UserRequest} from "@common/config/metadata";
import {Payment} from "../payment/data/model/payment.entity";
import {CreateOrderPayload} from "./data/payload/create-order.payload";
import {Order} from "./data/model/order.entity";
import {Role} from "@feature/security/data";
import {UpdateOrderStatusPayload} from "./data/payload/update-order-status.payload";
import {ApiTags} from "@nestjs/swagger";

@ApiTags('orders')
@Controller('orders')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Post()
    async createOrder(
        @UserReq() userReq: UserRequest,
        @Body() payload: CreateOrderPayload,
    ): Promise<Order> {
        return this.orderService.createOrderFromCart(payload.idCart, userReq.idUser);
    }

    @Get()
    async getUserOrders(@UserReq() userReq: UserRequest): Promise<Order[]> {
        return this.orderService.findOrdersByUser(userReq.idUser);
    }

    @Roles(Role.ADMIN)
    @Patch()
    async updateOrderStatus(
        @Body() payload: UpdateOrderStatusPayload,
    ): Promise<Order> {
        return this.orderService.updateOrderStatus(payload);
    }
}
