import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserService } from "@feature/user/user.service";
import { User } from "@feature/user/model/entity/user.entity";
import { UserController } from "@feature/user/user.controller";
import { CartModule } from "../cart/cart.module";
import {Cart} from "../cart/data/model/cart.entity";
import {Address} from "@common/model/address.entity";  // Assurez-vous d'importer correctement CartModule

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Cart, Address]),
    ],
    providers: [UserService],  // Pas besoin de CartService ici
    exports: [UserService, TypeOrmModule.forFeature([User])],
    controllers: [UserController]
})
export class UserModule {}
