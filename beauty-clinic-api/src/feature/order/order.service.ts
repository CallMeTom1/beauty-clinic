import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {Order} from "./data/model/order.entity";
import {OrderItem} from "./data/model/order-item.entity";
import {Cart} from "../cart/data/model/cart.entity";
import {User} from "@feature/user/model";
import {UpdateOrderStatusPayload} from "./data/payload/update-order-status.payload";
import {PaymentService} from "../payment/payment.service";


@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,

        @InjectRepository(OrderItem)
        private readonly orderItemRepository: Repository<OrderItem>,

        @InjectRepository(Cart)
        private readonly cartRepository: Repository<Cart>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        private readonly paymentService: PaymentService,  // Injection du service de paiement

    ) {}


    // Transformer un panier en commande et créer un paiement associé
    async createOrderFromCart(cartId: string, idUser: string): Promise<Order> {
        const cart = await this.cartRepository.findOne({
            where: { idCart: cartId },
            relations: ['items', 'items.product'],
        });

        if (!cart || cart.items.length === 0) {
            throw new NotFoundException('Cart is empty or not found');
        }

        let totalPrice = 0;
        const orderItems: OrderItem[] = cart.items.map((cartItem) => {
            const orderItem = this.orderItemRepository.create({
                product: cartItem.product,
                quantity: cartItem.quantity,
                price: cartItem.price,
            });

            totalPrice += cartItem.quantity * cartItem.price;
            return orderItem;
        });

        const user: User = await this.userRepository.findOne({ where: { idUser: idUser } });

        const order = this.orderRepository.create({
            totalPrice,
            status: 'pending',
            orderDate: new Date(),
            user,
            items: orderItems,
        });

        // Sauvegarder la commande en base de données
        const savedOrder = await this.orderRepository.save(order);

        // Créer un paiement associé à la commande via le service de paiement
        await this.paymentService.createPaymentIntent(totalPrice, 'usd', savedOrder.idOrder);

        return savedOrder;
    }


    // Récupérer toutes les commandes d'un utilisateur
    async findOrdersByUser(userId: string): Promise<Order[]> {
        return this.orderRepository.find({
            where: { user: { idUser: userId } }, // Utilise 'idUser' au lieu de 'id'
            relations: ['items', 'items.product'],
        });
    }


    // Mettre à jour le statut d'une commande
    async updateOrderStatus(payload: UpdateOrderStatusPayload): Promise<Order> {
        const order = await this.orderRepository.findOne({
            where: { idOrder: payload.idOrder }, // Utilise 'where' pour trouver la commande par son ID
        });

        if (!order) {
            throw new NotFoundException(`Order with id ${payload.idOrder} not found`);
        }

        order.status = payload.status;
        return this.orderRepository.save(order);
    }

}
