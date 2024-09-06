import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    Delete, Query
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { HolidayService } from './holiday.service';
import { Holiday } from './data/entity/holiday.entity';
import { CreateHolidayPayload } from './data/payload/create-holiday.payload';
import {Public, Roles} from '@common/config/metadata';
import { Role } from '@feature/security/data';
import {DeleteHolidayPayload} from "./data/payload/delete-holiday.payload";
import {CreateHolidayIntervalPayload} from "./data/payload/create-holiday-interval.payload";

@ApiTags('Holiday')
@Controller('holiday')
export class HolidayController {
    constructor(private readonly holidayService: HolidayService) {}

    @Public()
    @Get()
    @ApiOperation({ summary: 'Get all holidays' })
    async findAll(): Promise<Holiday[]> {
        return await this.holidayService.findAll();
    }


    @Roles(Role.ADMIN)
    @Post()
    @ApiOperation({ summary: 'Create a new holiday' })
    async create(@Body() createHolidayPayload: CreateHolidayPayload): Promise<Holiday> {
        return await this.holidayService.createHoliday(createHolidayPayload);
    }

    @Roles(Role.ADMIN)
    @Post('interval')
    @ApiOperation({ summary: 'Create holidays for an interval' })
    async createInterval(@Body() createHolidayIntervalPayload: CreateHolidayIntervalPayload): Promise<Holiday[]> {
        return await this.holidayService.createHolidayInterval(createHolidayIntervalPayload);
    }

    @Roles(Role.ADMIN)
    @Delete(':holiday_date')  // Utilisation de Paramètre de route pour la date
    @ApiOperation({ summary: 'Delete holiday by date' })
    async removeByDate(@Param('holiday_date') holidayDate: string): Promise<void> {
        const payload: DeleteHolidayPayload = { holiday_date: holidayDate };

        return await this.holidayService.removeByDate(payload);
    }

}
