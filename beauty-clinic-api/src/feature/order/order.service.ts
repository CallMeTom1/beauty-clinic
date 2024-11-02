import {Injectable, Logger, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Order} from "./data/model/order.entity";
import {OrderItem} from "./data/model/order-item.entity";
import {Cart} from "../cart/data/model/cart.entity";
import {User} from "@feature/user/model";
import {UpdateOrderStatusPayload} from "./data/payload/update-order-status.payload";
import {PaymentService} from "../payment/payment.service";
import {ulid} from "ulid";
import {CartService} from "../cart/cart.service";
import {UpdateShippingAddressPayload} from "./data/payload/update-shipping-address-order.payload";
import {Address} from "@common/model/address.entity";
import {ShippingFeeService} from "../shipping-fee/shipping-fee.service";
import {PromoCodeService} from "../promo-code/promo-code.service";
import {OrderStatus} from "./order-status.enum";
import {UpdateTrackingNumberPayload} from "./data/payload/update-tracking-number.payload";


@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Address) private readonly addressRepository: Repository<Address>,
        @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
        @InjectRepository(OrderItem) private readonly orderItemRepository: Repository<OrderItem>,
        @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly paymentService: PaymentService,
        private readonly cartService: CartService,
        private readonly shippingFeeService: ShippingFeeService,
        private readonly promoCodeService: PromoCodeService
    ) {}
    private readonly logger = new Logger(OrderService.name);



    async initiatePaymentIntent(idUser: string): Promise<any> {
        const user = await this.userRepository.findOne({
            where: { idUser },
            relations: ['cart', 'cart.items', 'cart.items.product', 'cart.promoCode'],
        });

        if (!user?.cart?.items.length) {
            throw new NotFoundException('Cart is empty or user not found');
        }

        // Calculate subtotal with proper decimal handling
        const subtotal = Number(user.cart.items.reduce((total, item) => {
            const price = item.product.is_promo ? item.product.price_discounted : item.product.initial_price;
            return total + (price * item.quantity);
        }, 0).toFixed(2));

        const discountAmount = Number((user.cart.discountAmount || 0).toFixed(2));
        const priceAfterDiscount = Number((subtotal - discountAmount).toFixed(2));
        const shippingFee = await this.shippingFeeService.calculateShippingFee(priceAfterDiscount);

        // Ensure final price is an integer for Stripe (in cents)
        const finalPrice = Math.round((priceAfterDiscount + shippingFee) * 100);

        const payment = await this.paymentService.createPayment(finalPrice, 'usd', idUser);

        return {
            subtotal,
            discountAmount,
            priceAfterDiscount,
            shippingFee,
            totalPrice: finalPrice / 100, // Convert back to decimal for response
            clientSecret: payment.clientSecret
        };
    }

    private findShippingAddress(addresses: Address[]): Address | undefined {
        return addresses.find(addr => addr.isDefault);
    }

    async createOrder(idUser: string, paymentStatus: string): Promise<Order> {
        if (paymentStatus !== 'succeeded') {
            throw new Error('Payment not successful');
        }

        const user = await this.userRepository.findOne({
            where: { idUser },
            relations: [
                'cart',
                'cart.items',
                'cart.items.product',
                'addresses',
                'cart.promoCode'
            ],
        });

        if (!user?.cart?.items.length) {
            throw new NotFoundException('Cart is empty or user not found');
        }

        // Trouver l'adresse de livraison par défaut
        const shippingAddress = this.findShippingAddress(user.addresses);
        if (!shippingAddress) {
            throw new Error('No default shipping address found');
        }

        const orderItems: OrderItem[] = user.cart.items.map((cartItem) => {
            const price = cartItem.product.is_promo ?
                cartItem.product.price_discounted :
                cartItem.product.initial_price;

            return this.orderItemRepository.create({
                id: ulid(),
                product: cartItem.product,
                quantity: cartItem.quantity,
                price: Number(price.toFixed(2))
            });
        });

        const subtotal = Number(orderItems.reduce(
            (total, item) => total + (item.price * item.quantity),
            0
        ).toFixed(2));

        const discountAmount = Number((user.cart.discountAmount || 0).toFixed(2));
        const priceAfterDiscount = Number((subtotal - discountAmount).toFixed(2));
        const shippingFee = await this.shippingFeeService.calculateShippingFee(priceAfterDiscount);

        const order = this.orderRepository.create({
            idOrder: ulid(),
            totalPrice: subtotal,
            discountAmount,
            shippingFee,
            totalPriceWithShipping: Number((priceAfterDiscount + shippingFee).toFixed(2)),
            status: OrderStatus.PENDING_SHIPPING,
            orderDate: new Date(),
            user,
            items: orderItems,
            shippingAddress, // Utilisation de l'adresse trouvée
            promoCode: user.cart.promoCode
        });

        if (user.cart.promoCode) {
            await this.promoCodeService.incrementUsage(user.cart.promoCode.promo_code_id);
        }

        const savedOrder = await this.orderRepository.save(order);
        await this.cartService.clearCart(idUser);

        return savedOrder;
    }


    // Récupérer toutes les commandes d'un utilisateur
    async findOrdersByUser(userId: string): Promise<Order[]> {
        return this.orderRepository.find({
            where: { user: { idUser: userId } },
            relations: [
                'items',
                'items.product',
                'user'  // Ajout de la relation user
            ],
        });
    }


    // Mettre à jour le statut d'une commande
    async updateOrderStatus(payload: UpdateOrderStatusPayload): Promise<Order> {
        const order: Order = await this.orderRepository.findOne({
            where: { idOrder: payload.idOrder },
            relations: [
                'user'  // Ajout de la relation user
            ]
        });

        if (!order) {
            throw new NotFoundException(`Order with id ${payload.idOrder} not found`);
        }

        order.status = payload.status;
        return this.orderRepository.save(order);
    }


    async getOrders(idUser: string): Promise<Order[]> {
        const user = await this.userRepository.findOne({ where: { idUser } });
        if (!user) {
            throw new NotFoundException(`User with ID ${idUser} not found`);
        }

        const orders = await this.orderRepository.find({
            where: { user: { idUser } },
            relations: [
                'items',
                'items.product',
                'payments',
                'shippingAddress',
                'user'  // Ajout de la relation user
            ],
            order: {
                orderDate: 'DESC'
            }
        });

        this.logger.debug(`Orders fetched for user ${idUser}:`);
        orders.forEach((order, index) => {
            this.logger.debug(`Order ${index + 1}:`);
            this.logger.debug(JSON.stringify({
                idOrder: order.idOrder,
                totalPrice: order.totalPrice,
                status: order.status,
                orderDate: order.orderDate,
                itemsCount: order.items.length,
                paymentsCount: order.payments.length,
                shippingAddress: order.shippingAddress,
                user: {
                    idUser: order.user.idUser,
                    firstname: order.user.firstname,
                    lastname: order.user.lastname
                }
            }, null, 2));
        });

        return orders;
    }

    async updateTrackingNumber(payload: UpdateTrackingNumberPayload): Promise<Order> {
        const order = await this.orderRepository.findOne({
            where: { idOrder: payload.idOrder },
            relations: [
                'user'  // Ajout de la relation user
            ]
        });

        if (!order) {
            throw new NotFoundException(`Order with id ${payload.idOrder} not found`);
        }

        if (order.status !== OrderStatus.PROCESSING && order.status !== OrderStatus.PENDING_SHIPPING) {
            throw new Error('Cannot add tracking number in current order status');
        }

        order.trackingNumber = payload.trackingNumber;
        order.status = OrderStatus.SHIPPED;

        const savedOrder = await this.orderRepository.save(order);
        this.logger.debug(`Updated tracking number for order ${payload.idOrder}: ${payload.trackingNumber}`);

        return savedOrder;
    }

    async getLastOrder(idUser: string): Promise<Order> {
        const order = await this.orderRepository.findOne({
            where: { user: { idUser } },
            relations: [
                'items',
                'items.product',
                'payments',
                'shippingAddress',
                'user'  // Ajout de la relation user
            ],
            order: {
                orderDate: 'DESC'
            }
        });

        if (!order) {
            throw new NotFoundException(`No orders found for user with ID ${idUser}`);
        }

        return order;
    }


    async updateOrderShippingAddress(payload: UpdateShippingAddressPayload): Promise<Order> {
        const order = await this.orderRepository.findOne({
            where: { idOrder: payload.idOrder },
            relations: ['items', 'items.product', 'payments', 'shippingAddress', 'user'],
        });

        if (!order) {
            throw new NotFoundException(`Order with id ${payload.idOrder} not found`);
        }

        if (!payload.road || !payload.nb || !payload.cp || !payload.town || !payload.country) {
            throw new Error('Missing required fields for shipping address');
        }

        // Créer une nouvelle adresse pour la commande
        const newAddress = this.addressRepository.create({
            address_id: ulid(),
            firstname: payload.firstname || order.user.firstname, // Utiliser le nom de l'utilisateur si non fourni
            lastname: payload.lastname || order.user.lastname,
            road: payload.road,
            nb: payload.nb,
            cp: payload.cp,
            town: payload.town,
            country: payload.country,
            complement: payload.complement,
            label: 'Order Address', // Label spécifique pour les adresses de commande
            isDefault: false // Ne pas en faire une adresse par défaut
        });

        order.shippingAddress = await this.addressRepository.save(newAddress);

        return await this.orderRepository.save(order);
    }

}
