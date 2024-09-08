import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserService } from "@feature/user/user.service";
import { User } from "@feature/user/model/entity/user.entity";
import {UserController} from "@feature/user/user.controller";
@Module({
    imports: [
        TypeOrmModule.forFeature([User])
    ],
    providers: [UserService],
    exports: [UserService],
    controllers: [UserController]
})
export class UserModule {}