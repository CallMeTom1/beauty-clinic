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

    /*
    @Public()
    @Get(':date')
    @ApiOperation({ summary: 'Get holiday by date' })
    async findOneByDate(@Param('date') date: string): Promise<Holiday> {
        const parsedDate = new Date(date);
        return await this.holidayService.findOneByDate(parsedDate);
    }
    */

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
    @Delete()
    @ApiOperation({ summary: 'Delete holiday by date' })
    async removeByDate(@Query() payload: DeleteHolidayPayload): Promise<void> {
        return await this.holidayService.removeByDate(payload);
    }
}
