import { InjectRepository } from '@nestjs/typeorm';
import {Injectable} from '@nestjs/common';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigKey, configManager } from '@common/config';
import { Builder } from 'builder-pattern';
import {ulid} from "ulid";
import {
    TokenGenerationException, TokenNotFoundException,
    TokenRevokedException,
    UserNotFoundException
} from "@feature/security/security.exception";
import {Role, Token} from "@feature/security/data";
import {Credential} from "@feature/security/data";

@Injectable()
export class TokenService {
    constructor(@InjectRepository(Token) private readonly repository: Repository<Token>,
                @InjectRepository(Credential) private readonly credentialRepository: Repository<Credential>,
                private jwtService: JwtService) {
    }

    async verifyTokenExists(tokenString: string): Promise<boolean> {
        const tokenEntity = await this.repository.findOne({
            where: { token: tokenString }
        });

        if (!tokenEntity) {
            throw new TokenRevokedException();
        }

        return true;
    }

    async getTokens(credential: Credential): Promise<any> {
        try {

            await this.deleteFor(credential)

            const payload: {sub: string, roles: Role[]} = {
                sub: credential.credential_id,
                roles: [credential.role]
            };

            //générer le token
            const token: string = this.jwtService.sign(payload, {
                secret: configManager.getValue(ConfigKey.JWT_TOKEN_SECRET),
                expiresIn: configManager.getValue(ConfigKey.JWT_TOKEN_EXPIRE_IN)
            });

            //générer le refresh token
            const refreshToken: string = this.jwtService.sign(payload, {
                secret: configManager.getValue(ConfigKey.JWT_REFRESH_TOKEN_SECRET),
                expiresIn: configManager.getValue(ConfigKey.JWT_REFRESH_TOKEN_EXPIRE_IN)
            });

            const tokenRecord: Token = Builder<Token>()
                .token_id(ulid())
                .token(token)
                .refreshToken(refreshToken)
                .credential(credential)
                .build();

            await this.repository.upsert(tokenRecord, ['credential']);

            const user: Credential = await this.credentialRepository.findOne({
                where: {credential_id: credential.credential_id},
                relations: ['user']
            });

            return {
                token: token,
                refreshToken: refreshToken,
                user: user ? {
                    idUser: user.user.idUser,
                    role: user.role
                } : null
            };

        } catch (e) {
            throw new TokenGenerationException();
        }
    }

    async revokeToken(token: string): Promise<void> {
        const tokenEntity = await this.repository.findOne({
            where: { token: token }
        });

        if (tokenEntity) {
            await this.repository.remove(tokenEntity);
        }
    }



    async deleteFor(credential: Credential): Promise<void> {
        await this.repository.delete({credential})
    }

    async refresh(tokenString: string): Promise<Token> {
        if (typeof tokenString !== 'string' || tokenString.trim() === '') {
            throw new TokenNotFoundException();
        }

        // Vérifier si le token existe en base
        await this.verifyTokenExists(tokenString);

        try {
            const decoded = await this.jwtService.verify(tokenString, {
                secret: configManager.getValue(ConfigKey.JWT_TOKEN_SECRET),
                ignoreExpiration: true
            });

            const credential: Credential = await this.credentialRepository.findOneBy({
                credential_id: decoded.sub
            });

            if (!credential) {
                throw new UserNotFoundException();
            }

            // Révoquer l'ancien token
            await this.revokeToken(tokenString);

            // Générer un nouveau token
            return await this.getTokens(credential);
        } catch (e) {
            if (e instanceof TokenRevokedException) {
                throw new TokenRevokedException();
            }
            if (e instanceof UserNotFoundException) {
                throw new UserNotFoundException();
            }
            throw new TokenGenerationException();
        }
    }
}