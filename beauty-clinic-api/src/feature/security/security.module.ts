import { ConfigKey, configManager } from "@common/config";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Token, Credential} from "@feature/security/data";
import {UserModule} from "@feature/user/user.module";
import {User} from "@feature/user/model/entity/user.entity";
import {SecurityController} from "@feature/security/security.controller";
import {TokenService} from "./service/token.service"
import {SecurityService} from "./service/security.service";
import {MailService} from "@feature/security/service/mail.service";
import {ResetToken} from "@feature/security/data/entity/reset-token.entity";
import {ResetTokenService} from "@feature/security/service/reset-token.service";

@Module({
    imports: [
        JwtModule.register({
            global: true,
            secret: configManager.getValue(ConfigKey.JWT_TOKEN_SECRET),
            signOptions: {expiresIn: configManager.getValue(ConfigKey.JWT_TOKEN_EXPIRE_IN)},
        }),
        TypeOrmModule.forFeature([Credential, Token, User, ResetToken]),
        UserModule
    ],
    providers: [TokenService, SecurityService, MailService, ResetTokenService],
    exports: [SecurityService, ResetTokenService, TokenService],
    controllers: [SecurityController]
})
export class SecurityModule {
}