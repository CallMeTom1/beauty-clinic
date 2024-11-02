import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './data/model/order.entity';  // Import de l'entité order
import { OrderItem } from './data/model/order-item.entity';  // Import de l'entité OrderItem
import { Cart } from '../cart/data/model/cart.entity';  // Import de l'entité Cart
import { User } from '@feature/user/model';  // Import de l'entité User
import { OrderService } from './order.service';  // Import du service order
import { OrderController } from './order.controller';
import {PaymentModule} from "../payment/payment.module";
import {CartModule} from "../cart/cart.module";
import {Address} from "@common/model/address.entity";
import {ShippingFeeModule} from "../shipping-fee/shipping-fee.module";
import {PromoCodeModule} from "../promo-code/promo-code.module";  // Import du contrôleur order

@Module({
    imports: [
        TypeOrmModule.forFeature([Order, OrderItem, Cart, User, Address]),  // Déclaration des entités dans TypeORM
        PaymentModule,
        CartModule,
        ShippingFeeModule,
        PromoCodeModule
    ],
    providers: [OrderService],  // Le service order
    controllers: [OrderController],  // Le contrôleur order
    exports: [OrderService],  // Export du service pour l'utiliser ailleurs si nécessaire
})
export class OrderModule {}
