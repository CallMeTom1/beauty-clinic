import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Payment} from "./data/model/payment.entity";
import {PaymentService} from "./payment.service";
import {PaymentController} from "./payment.controller";
import {UserModule} from "@feature/user/user.module";


@Module({
    imports: [TypeOrmModule.forFeature([Payment]), UserModule],
    providers: [PaymentService],
    controllers: [PaymentController],
    exports: [PaymentService],
})
export class PaymentModule {}
