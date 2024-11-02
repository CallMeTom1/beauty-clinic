
// shipping-fee.controller.ts
import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ShippingFeeService } from './shipping-fee.service';
import { Roles } from '@common/config/metadata';
import { Role } from '@feature/security/data';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateShippingFeePayload } from "./data/payload/update-shipping-fee.payload";
import { ShippingFee } from "./data/model/shipping-fee.entity";

@ApiTags('shipping')
@Controller('shipping-fees')
export class ShippingFeeController {
    constructor(private readonly shippingFeeService: ShippingFeeService) {}

    @Get()
    @ApiOperation({ summary: 'Get current active shipping fee configuration' })
    @ApiResponse({
        status: 200,
        description: 'Retourne les frais de livraison actifs (ou crée et retourne des frais par défaut si aucun n\'existe)',
    })
    async getActiveShippingFee(): Promise<ShippingFee> {
        return this.shippingFeeService.getShippingFee();
    }

    @Roles(Role.ADMIN)
    @Put()
    @ApiOperation({ summary: 'Update shipping fee configuration' })
    @ApiResponse({
        status: 200,
        description: 'Frais de livraison mis à jour avec succès'
    })
    async updateShippingFee(
        @Body() payload: UpdateShippingFeePayload
    ): Promise<ShippingFee> {
        return this.shippingFeeService.updateShippingFee(payload);
    }
}