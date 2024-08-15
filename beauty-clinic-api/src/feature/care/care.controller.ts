import {Body, Controller, Delete, Get, Post, Put, Query} from '@nestjs/common';
import { CareService } from '@feature/care/care.service';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '@common/config/metadata';
import { Care, CreateCarePayload, DeleteCarePayload, ModifyCarePayload } from '@feature/care/data';
import { Role } from '@feature/security/data';
import { GetCaresByCategoryPayload } from '@feature/care/data/payload/get-care-by-category.payload';
import {GetCaresPaginatedPayload} from "@feature/care/data/payload/get-cares-paginated.payload";

@ApiTags('Care')
@Controller('care')
export class CareController {
    constructor(private readonly careService: CareService) {}

    @Get()
    getAllCares(): Promise<Care[]> {
        return this.careService.getAllCares();
    }

    @Get('category')
    getCaresByCategory(@Body() payload: GetCaresByCategoryPayload): Promise<Care[]> {
        return this.careService.getCaresByCategory(payload);
    }

    @Post()
    @Roles(Role.ADMIN)
    createCare(@Body() payload: CreateCarePayload): Promise<Care> {
        return this.careService.createCare(payload);
    }

    @Put()
    @Roles(Role.ADMIN)
    modifyCare(@Body() payload: ModifyCarePayload): Promise<Care> {
        return this.careService.modifyCare(payload);
    }

    @Delete()
    @Roles(Role.ADMIN)
    deleteCare(@Body() payload: DeleteCarePayload): Promise<void> {
        return this.careService.deleteCare(payload);
    }

    @Get('paginated')
    getCaresPaginated(@Query() query: GetCaresPaginatedPayload): Promise<{ data: Care[], total: number }> {
        return this.careService.getCaresPaginated(query);
    }

}
