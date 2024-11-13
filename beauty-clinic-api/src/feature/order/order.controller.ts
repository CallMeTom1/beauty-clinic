import {Controller, Post, Get, Patch, Param, Body, Put} from '@nestjs/common';
import { OrderService } from './order.service';
import {User} from "@feature/user/model";
import {Public, Roles, UserReq, UserRequest} from "@common/config/metadata";
import {Payment} from "../payment/data/model/payment.entity";
import {CreateOrderPayload} from "./data/payload/create-order.payload";
import {Order} from "./data/model/order.entity";
import {Role} from "@feature/security/data";
import {UpdateOrderStatusPayload} from "./data/payload/update-order-status.payload";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {UpdateShippingAddressPayload} from "./data/payload/update-shipping-address-order.payload";
import {UpdateTrackingNumberPayload} from "./data/payload/update-tracking-number.payload";

@ApiTags('orders')
@Controller('orders')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Post()
    async initiatePaymentIntent(
        @UserReq() userReq: UserRequest
    ): Promise<any> {
        return this.orderService.initiatePaymentIntent(userReq.idUser);
    }

    @Post('create')
    async createOrder(
        @UserReq() userReq: UserRequest,
        @Body() payload: { paymentStatus: string }
    ): Promise<Order> {
        return this.orderService.createOrder(userReq.idUser, payload.paymentStatus);
    }

    @Get('last')
    async getLastOrder(@UserReq() userReq: UserRequest): Promise<Order> {
        return this.orderService.getLastOrder(userReq.idUser);
    }

    @Get()
    async getOrders(
        @UserReq() userReq: UserRequest,
    ): Promise<Order[]> {
        return this.orderService.getOrders(userReq.idUser);
    }

    @Public()
    @Put('tracking-number')
    @ApiOperation({ summary: 'Update order tracking number' })
    async updateTrackingNumber(
        @Body() payload: UpdateTrackingNumberPayload
    ): Promise<Order> {
        return this.orderService.updateTrackingNumber(payload);
    }

    @Public()
    @Put()
    async updateOrderStatus(
        @Body() payload: UpdateOrderStatusPayload,
    ): Promise<Order> {
        console.log('payload order status',payload)
        return this.orderService.updateOrderStatus(payload);
    }

    @Put('shipping-address')
    @ApiOperation({ summary: 'Update shipping address of an order' })
    async updateShippingAddress(@Body() payload: UpdateShippingAddressPayload): Promise<Order> {
        return this.orderService.updateOrderShippingAddress(payload);
    }
}
