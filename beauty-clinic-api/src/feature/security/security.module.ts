import { ConfigKey, configManager } from "@common/config";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SecurityService, TokenService } from "@feature/security/service";
import { Token, Credential} from "@feature/security/data";
import { FacebookStrategy, GoogleStrategy } from "@feature/security/strategy";
import {UserModule} from "@feature/user/user.module";
import {User} from "@feature/user/model/entity/user.entity";
import {SecurityController} from "@feature/security/security.controller";

@Module({
    imports: [
        JwtModule.register({
            global: true,
            secret: configManager.getValue(ConfigKey.JWT_TOKEN_SECRET),
            signOptions: {expiresIn: configManager.getValue(ConfigKey.JWT_TOKEN_EXPIRE_IN)},
        }),
        TypeOrmModule.forFeature([Credential, Token, User]),
        UserModule
    ],
    providers: [TokenService, SecurityService, GoogleStrategy, FacebookStrategy],
    exports: [SecurityService],
    controllers: [SecurityController]
})
export class SecurityModule {
}