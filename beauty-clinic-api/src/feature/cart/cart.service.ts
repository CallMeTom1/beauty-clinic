import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Cart} from "./data/model/cart.entity";
import {Repository} from "typeorm";
import {CartItem} from "./data/model/cart-item.entity";
import {Product} from "../product/data/entity/product.entity";
import {User} from "@feature/user/model";
import {UserNotFoundException} from "@feature/security/security.exception";
import {ulid} from "ulid";
import {
    AddItemToCartException,
    CartNotFoundException,
    CreateCartException, RemoveCartException,
    UpdateCartException
} from "./cart.exception";
import {ProductNotFoundException} from "../product/product.exception";
import {UpdateCartItemPayload} from "./data/payload/update-cart-item.payload";
import {RemoveCartItemPayload} from "./data/payload/remove-cart-item.payload";
import {AddCartItemPayload} from "./data/payload/add-cart-item.payload";
import {PromoCodeService} from "../promo-code/promo-code.service";
import {ApplyPromoCodeCartPayload} from "./data/payload/apply-promo-code-cart.payload";

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart)
        private readonly cartRepository: Repository<Cart>,

        @InjectRepository(CartItem)
        private readonly cartItemRepository: Repository<CartItem>,

        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        private readonly promoCodeService: PromoCodeService

    ) {}

    private async recalculateDiscount(cart: Cart): Promise<Cart> {
        if (cart.promoCode) {
            // Réutiliser le service de promo pour recalculer avec le même code
            const { discountAmount } = await this.promoCodeService.validateAndCalculateDiscount(
                cart.promoCode.code,
                cart
            );
            cart.discountAmount = discountAmount;
        }
        return cart;
    }

    async createCart(idUser: string): Promise<Cart>{
        try{
            const user: User = await this.userRepository.findOne({
                where: {idUser: idUser}
            })
            if(!user){
                throw new UserNotFoundException();
            }

            const newCart: Cart = this.cartRepository.create({
                idCart : ulid(),
                user : user
            });

            return await this.cartRepository.save(newCart);
        }
        catch(e){
            throw new CreateCartException();
        }
    }

    // Ajouter un produit au panier
    async addToCart(idUser: string, payload: AddCartItemPayload): Promise<Cart> {
        try {
            const cart: Cart = await this.cartRepository.findOne({
                where: { user: { idUser: idUser } },
                relations: ['items', 'items.product', 'promoCode'],
            });

            if (!cart) {
                throw new CartNotFoundException();
            }

            const product: Product = await this.productRepository.findOne({
                where: { product_id: payload.productId },
            });

            if (!product) {
                throw new ProductNotFoundException();
            }

            let cartItem: CartItem = cart.items.find(item => item.product.product_id === payload.productId);

            if (cartItem) {
                cartItem.quantity += payload.quantity;
            } else {
                cartItem = this.cartItemRepository.create({
                    idCartItem: ulid(),
                    product,
                    quantity: payload.quantity,
                    cart,
                });
                cart.items.push(cartItem);
            }

            // Recalculer la réduction si un code promo est appliqué
            await this.recalculateDiscount(cart);

            return this.cartRepository.save(cart);
        } catch (e) {
            throw new AddItemToCartException();
        }
    }


    // Mettre à jour la quantité d'un produit dans le panier
    // Mettre à jour la quantité d'un produit dans le panier
    async updateCartItem(idUser: string, payload: UpdateCartItemPayload): Promise<Cart> {
        try {
            const cart: Cart = await this.cartRepository.findOne({
                where: { user: { idUser: idUser } },
                relations: ['items', 'items.product', 'promoCode'],
            });

            if (!cart) {
                throw new CartNotFoundException();
            }

            const cartItem: CartItem = cart.items.find(item => item.idCartItem === payload.cartItemId);

            if (!cartItem) {
                throw new NotFoundException(`Cart item with id ${payload.cartItemId} not found`);
            }

            cartItem.quantity = payload.newQuantity;

            // Recalculer la réduction si un code promo est appliqué
            await this.recalculateDiscount(cart);

            return this.cartRepository.save(cart);
        } catch (e) {
            throw new UpdateCartException();
        }
    }

    // Supprimer un produit du panier
    // Supprimer un produit du panier
    async removeFromCart(idUser: string, payload: RemoveCartItemPayload): Promise<Cart> {
        try {
            const cart: Cart = await this.cartRepository.findOne({
                where: { user: { idUser: idUser } },
                relations: ['items', 'items.product', 'promoCode'],
            });

            if (!cart) {
                throw new CartNotFoundException();
            }

            const cartItemIndex: number = cart.items.findIndex(item => item.idCartItem === payload.cartItemId);

            if (cartItemIndex === -1) {
                throw new NotFoundException(`Cart item with id ${payload.cartItemId} not found`);
            }

            cart.items.splice(cartItemIndex, 1);

            // Recalculer la réduction si un code promo est appliqué
            await this.recalculateDiscount(cart);

            return this.cartRepository.save(cart);
        } catch (e) {
            throw new RemoveCartException();
        }
    }

    async applyPromoCode(userId: string, payload: ApplyPromoCodeCartPayload): Promise<Cart> {
        const cart = await this.cartRepository.findOne({
            where: { user: { idUser: userId } },
            relations: ['items', 'items.product', 'promoCode']
        });

        if (!cart) {
            throw new CartNotFoundException();
        }

        console.log('apres cart')


        // Valider le code promo et calculer la réduction
        const { promoCode, discountAmount } = await this.promoCodeService.validateAndCalculateDiscount(
            payload.code,
            cart
        );
        console.log(promoCode, discountAmount)

        // Appliquer le code promo et la réduction au panier
        cart.promoCode = promoCode;
        cart.discountAmount = discountAmount;

        return this.cartRepository.save(cart);
    }

    async removePromoCode(userId: string): Promise<Cart> {
        const cart = await this.cartRepository.findOne({
            where: { user: { idUser: userId } },
            relations: ['promoCode']
        });

        if (!cart) {
            throw new CartNotFoundException();
        }

        cart.promoCode = null;
        cart.discountAmount = null;

        return this.cartRepository.save(cart);
    }


    // Modifier getCart pour inclure les infos de promo
    async getCart(idUser: string): Promise<Cart> {
        try {
            const cart = await this.cartRepository.findOne({
                where: { user: { idUser } },
                relations: ['items', 'items.product', 'promoCode']
            });

            if (!cart) {
                throw new CartNotFoundException();
            }

            return cart;
        } catch (e) {
            throw new CartNotFoundException();
        }
    }

    async clearCart(idUser: string): Promise<Cart> {
        try {
            const cart = await this.cartRepository.findOne({
                where: { user: { idUser } },
                relations: ['items']
            });

            if (!cart) {
                throw new CartNotFoundException();
            }

            cart.items = [];
            cart.promoCode = null;
            cart.discountAmount = null;

            return await this.cartRepository.save(cart);
        } catch (e) {
            throw new CartNotFoundException();
        }
    }

}