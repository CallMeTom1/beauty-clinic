// promo-code.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromoCodeService } from './promo-code.service';
import { PromoCode } from './data/model/promo-code.entity';
import {PromoCodeController} from "./promo-code.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([PromoCode]),
    ],
    controllers: [PromoCodeController],
    providers: [PromoCodeService],
    exports: [PromoCodeService]
})
export class PromoCodeModule {}