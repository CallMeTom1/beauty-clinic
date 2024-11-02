// shipping-fee.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShippingFeeService } from './shipping-fee.service';
import { ShippingFeeController } from './shipping-fee.controller';
import {ShippingFee} from "./data/model/shipping-fee.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([ShippingFee]),
    ],
    controllers: [ShippingFeeController],
    providers: [ShippingFeeService],
    exports: [ShippingFeeService], // Export du service pour qu'il soit utilisable dans d'autres modules
})
export class ShippingFeeModule {}