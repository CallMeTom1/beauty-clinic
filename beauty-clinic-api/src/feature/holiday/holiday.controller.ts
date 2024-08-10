import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    Delete
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { HolidayService } from './holiday.service';
import { Holiday } from './data/entity/holiday.entity';
import { CreateHolidayPayload } from './data/payload/create-holiday.payload';
import {Public, Roles} from '@common/config/metadata';
import { Role } from '@feature/security/data';

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

    @Public()
    @Get(':date')
    @ApiOperation({ summary: 'Get holiday by date' })
    async findOneByDate(@Param('date') date: string): Promise<Holiday> {
        const parsedDate = new Date(date);
        return await this.holidayService.findOneByDate(parsedDate);
    }

    @Roles(Role.ADMIN)
    @Post()
    @ApiOperation({ summary: 'Create a new holiday' })
    async create(@Body() createHolidayPayload: CreateHolidayPayload): Promise<Holiday> {
        return await this.holidayService.create(createHolidayPayload);
    }

    @Roles(Role.ADMIN)
    @Delete(':date')
    @ApiOperation({ summary: 'Delete holiday by date' })
    async removeByDate(@Param('date') date: string): Promise<void> {
        const parsedDate = new Date(date);
        return await this.holidayService.removeByDate(parsedDate);
    }
}
