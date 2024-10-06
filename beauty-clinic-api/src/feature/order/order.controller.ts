import { Controller, Post, Get, Patch, Param, Body } from '@nestjs/common';
import { OrderService } from './order.service';
import {User} from "@feature/user/model";

@Controller('orders')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Post(':cartId/create')
    async createOrder(
        @Param('cartId') cartId: number,
        @Body('user') user: User,  // Assure-toi d'avoir l'utilisateur dans la session ou JWT
    ) {
        return this.orderService.createOrderFromCart(cartId, user);
    }

    @Get('user/:userId')
    async getUserOrders(@Param('userId') userId: string) {
        return this.orderService.findOrdersByUser(userId);
    }

    @Patch(':orderId/status')
    async updateOrderStatus(
        @Param('orderId') orderId: number,
        @Body('status') status: string,
    ) {
        return this.orderService.updateOrderStatus(orderId, status);
    }
}
