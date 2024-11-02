import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {ResetToken} from "@feature/security/data/entity/reset-token.entity";
import {MoreThan, Repository} from "typeorm";
import {ulid} from "ulid";
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';
import {Credential} from "@feature/security/data";

@Injectable()
export class ResetTokenService {
    constructor(
        @InjectRepository(ResetToken)
        private resetTokenRepository: Repository<ResetToken>
    ) {}

    async createToken(credential: Credential): Promise<string> {
        const plainToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = await bcrypt.hash(plainToken, 10);

        const resetToken: ResetToken = this.resetTokenRepository.create({
            reset_token_id: ulid(),
            token: hashedToken,
            expiresAt: new Date(Date.now() + 3600000), // 1 heure
            credential,
            used: false
        });

        await this.resetTokenRepository.save(resetToken);
        return plainToken;
    }

    async findValidToken(plainToken: string): Promise<ResetToken | null> {
        const tokens = await this.resetTokenRepository.find({
            where: {
                used: false,
                expiresAt: MoreThan(new Date())
            },
            relations: ['credential']
        });

        for (const token of tokens) {
            const isValid = await bcrypt.compare(plainToken, token.token);
            if (isValid) {
                return token;
            }
        }

        return null;
    }

    async invalidateToken(token: ResetToken): Promise<void> {
        token.used = true;
        await this.resetTokenRepository.save(token);
    }

    async deleteExpiredTokens(): Promise<void> {
        await this.resetTokenRepository.delete({
            expiresAt: MoreThan(new Date())
        });
    }
}