import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Payment } from './data/model/payment.entity';
import {ApiTags} from "@nestjs/swagger";

@ApiTags('payments')
@Controller('payments')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}

    @Get(':id')
    async getPayment(@Param('id') paymentId: string): Promise<Payment> {
        return this.paymentService.findPaymentById(paymentId);
    }

    @Post(':id/refund')
    async refundPayment(@Param('id') paymentId: string): Promise<Payment> {
        return this.paymentService.refundPayment(paymentId);
    }

    @Get('order/:orderId')
    async getPaymentsForOrder(@Param('orderId') orderId: string): Promise<Payment[]> {
        return this.paymentService.getPaymentsForOrder(orderId);
    }

    @Post('test-payment')
    async createAndConfirmPayment(
        @Body('amount') amount: number,
        @Body('currency') currency: string,
        @Body('orderId') orderId: string,
    ) {
        return this.paymentService.createAndConfirmPayment(amount, currency, orderId);
    }
}
