import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Cart} from "./data/model/cart.entity";
import {CartService} from "./cart.service";
import {CartController} from "./cart.controller";
import {CartItem} from "./data/model/cart-item.entity";
import {Product} from "../product/data/entity/product.entity";
import {User} from "@feature/user/model";
import {PromoCodeModule} from "../promo-code/promo-code.module";

@Module({
    imports: [TypeOrmModule.forFeature([Cart, CartItem, User, Product]),
        PromoCodeModule
    ],
    providers: [CartService],
    controllers: [CartController],
    exports: [CartService],
})
export class CartModule {}