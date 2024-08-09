import { InjectRepository } from '@nestjs/typeorm';
import {Injectable} from '@nestjs/common';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigKey, configManager } from '@common/config';
import { Builder } from 'builder-pattern';
import {ulid} from "ulid";
import {TokenGenerationException, UserNotFoundException} from "@feature/security/security.exception";
import {Token} from "@feature/security/data";
import {Credential} from "@feature/security/data";

@Injectable()
export class TokenService {
    constructor(@InjectRepository(Token) private readonly repository: Repository<Token>,
                @InjectRepository(Credential) private readonly credentialRepository: Repository<Credential>,
                private jwtService: JwtService) {
    }

    async getTokens(credential: Credential): Promise<any> {
        try {
            await this.deleteFor(credential)
            const payload = {
                sub: credential.credential_id,
                roles: [credential.role]
            };
            const token: string = this.jwtService.sign(payload, {
                secret: configManager.getValue(ConfigKey.JWT_TOKEN_SECRET),
                expiresIn: configManager.getValue(ConfigKey.JWT_TOKEN_EXPIRE_IN)
            });

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


    async deleteFor(credential: Credential): Promise<void> {
        await this.repository.delete({credential})
    }

    async refresh(tokenString: string): Promise<Token> {
        if (typeof tokenString !== 'string' || tokenString.trim() === '') {
            throw new UserNotFoundException();
        }

        try {
            const decoded = await this.jwtService.verify(tokenString, {
                secret: configManager.getValue(ConfigKey.JWT_TOKEN_SECRET),
                ignoreExpiration: true
            });

            const credential: Credential = await this.credentialRepository.findOneBy({ credential_id: decoded.sub });
            if (!credential) {
                throw new UserNotFoundException();
            }

            return await this.getTokens(credential);
        } catch (e) {
            if(e instanceof UserNotFoundException)
                throw new UserNotFoundException();

            throw new TokenGenerationException();
        }
    }
}