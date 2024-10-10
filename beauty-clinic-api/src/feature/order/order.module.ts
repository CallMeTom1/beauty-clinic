import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './data/model/order.entity';  // Import de l'entité Order
import { OrderItem } from './data/model/order-item.entity';  // Import de l'entité OrderItem
import { Cart } from '../cart/data/model/cart.entity';  // Import de l'entité Cart
import { User } from '@feature/user/model';  // Import de l'entité User
import { OrderService } from './order.service';  // Import du service Order
import { OrderController } from './order.controller';
import {PaymentModule} from "../payment/payment.module";  // Import du contrôleur Order

@Module({
    imports: [
        TypeOrmModule.forFeature([Order, OrderItem, Cart, User]),  // Déclaration des entités dans TypeORM
        PaymentModule
    ],
    providers: [OrderService],  // Le service Order
    controllers: [OrderController],  // Le contrôleur Order
    exports: [OrderService],  // Export du service pour l'utiliser ailleurs si nécessaire
})
export class OrderModule {}
