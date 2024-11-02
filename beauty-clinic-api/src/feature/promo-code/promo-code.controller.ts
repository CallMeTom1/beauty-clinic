import {
    Controller,
    Post,
    Get,
    Put,
    Delete,
    Body,
    Param,
    HttpCode,
} from '@nestjs/common';
import { PromoCodeService } from './promo-code.service';
import {Public, Roles, UserReq, UserRequest} from "@common/config/metadata";
import { Role } from "@feature/security/data";
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreatePromoCodePayload } from "./data/payload/create-promo-code.payload";
import { UpdatePromoCodePayload } from "./data/payload/update-promo-code.payload";
import { PromoCode } from "./data/model/promo-code.entity";
import {DeletePromoCodePayload} from "./data/payload/delete-promo-code.payload";

@ApiTags('promo-codes')
@Controller('promo-codes')
export class PromoCodeController {
    constructor(
        private readonly promoCodeService: PromoCodeService,
    ) {}

    @Public()
    @Get()
    @ApiOperation({ summary: 'Obtenir tous les codes promo' })
    @ApiResponse({
        status: 200,
        description: 'Liste des codes promo',
        type: [PromoCode]
    })
    async getAllPromoCodes(): Promise<PromoCode[]> {
        return this.promoCodeService.getAllPromoCodes();
    }

    @Public()
    @Post()
    @ApiOperation({ summary: 'Créer un nouveau code promo' })
    @ApiResponse({
        status: 201,
        description: 'Code promo créé',
        type: PromoCode
    })
    async createPromoCode(
        @Body() payload: CreatePromoCodePayload
    ): Promise<PromoCode> {
        return this.promoCodeService.createPromoCode(payload);
    }

    @Put()
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Mettre à jour un code promo' })
    @ApiResponse({
        status: 200,
        description: 'Code promo mis à jour',
        type: PromoCode
    })
    async updatePromoCode(
        @Body() payload: UpdatePromoCodePayload
    ): Promise<PromoCode> {
        console.log(payload)
        return this.promoCodeService.updatePromoCode(payload);
    }

    @Delete()
    @Roles(Role.ADMIN)
    @HttpCode(204)
    @ApiOperation({ summary: 'Supprimer un code promo' })
    @ApiResponse({
        status: 204,
        description: 'Code promo supprimé'
    })
    async deletePromoCode(@Body() payload: DeletePromoCodePayload): Promise<void> {
        return this.promoCodeService.deletePromoCode(payload.promo_code_id);
    }
}