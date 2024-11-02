import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishlistController } from './wishlist.controller';
import { WishlistService } from './wishlist.service';
import { User } from '@feature/user/model';
import { Care } from '@feature/care/data';
import {Wishlist} from "./data/model/wishlist.entity";
import {Product} from "../product/data/entity/product.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Wishlist,
            User,
            Product,
            Care
        ])
    ],
    controllers: [WishlistController],
    providers: [WishlistService],
    exports: [WishlistService]
})
export class WishlistModule {}