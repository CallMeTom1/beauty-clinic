import { BodyZoneEntity } from "./data/entity/body-zone.entity";
import {Body, Controller, Delete, Get, Param, Post, Put} from "@nestjs/common";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Public, Roles} from "@common/config/metadata";
import {Role} from "@feature/security/data";
import {CreateBodyZonePayload} from "./data/payload/create-body-zone.payload";
import {UpdateBodyZonePayload} from "./data/payload/update-body-zone.payload";
import {DeleteBodyZonePayload} from "./data/payload/delete-body-zone.payload";
import {BodyZoneService} from "./body-zone.service";

@ApiTags('BodyZone')
@Controller('body-zone')
export class BodyZoneController {
    constructor(private readonly bodyZoneService: BodyZoneService) {}

    @Public()
    @Get()
    @ApiOperation({ summary: 'Get all body zones' })
    @ApiResponse({
        status: 200,
        description: 'List of all body zones',
        type: [BodyZoneEntity]
    })
    getAllBodyZones(): Promise<BodyZoneEntity[]> {
        return this.bodyZoneService.findAll();
    }

    @Post()
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Create a new body zone' })
    @ApiResponse({
        status: 201,
        description: 'The body zone has been created',
        type: BodyZoneEntity
    })
    createBodyZone(@Body() payload: CreateBodyZonePayload): Promise<BodyZoneEntity> {
        return this.bodyZoneService.create(payload);
    }

    @Put()
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Update a body zone' })
    @ApiResponse({
        status: 200,
        description: 'The body zone has been updated',
        type: BodyZoneEntity
    })
    async updateBodyZone(
        @Body() payload: UpdateBodyZonePayload
    ): Promise<BodyZoneEntity> {
        return await this.bodyZoneService.update(payload);
    }

    @Delete()
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Delete a body zone' })
    @ApiResponse({ status: 204, description: 'The body zone has been deleted' })
    async deleteBodyZone(@Body() payload: DeleteBodyZonePayload): Promise<void> {
        return this.bodyZoneService.remove(payload);
    }
}