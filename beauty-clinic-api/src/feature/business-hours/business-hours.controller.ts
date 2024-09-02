import {
    Body,
    Controller,
    Get,
    Param,
    Put
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BusinessHoursService } from './business-hours.service';
import { BusinessHours } from './data/entity/business-hours.entity';
import { UpdateBusinessHoursPayload } from './data/payload/update-business-hours.payload';
import { DayOfWeekEnum } from './data/day-of-week.enum';
import { Public, Roles } from '@common/config/metadata';
import { Role } from '@feature/security/data';

@ApiTags('BusinessHours')
@Controller('business-hours')
export class BusinessHoursController {
    constructor(private readonly businessHoursService: BusinessHoursService) {}

    @Public()
    @Get()
    @ApiOperation({ summary: 'Get all business hours' })
    async findAll(): Promise<BusinessHours[]> {
        return await this.businessHoursService.findAllBusinessHours();
    }

    @Roles(Role.ADMIN)
    @Put(':day_of_week')
    @ApiOperation({ summary: 'Update business hours by day of the week' })
    async updateByDayOfWeek(
        @Param('day_of_week') day_of_week: DayOfWeekEnum,
        @Body() updateBusinessHoursPayload: UpdateBusinessHoursPayload
    ): Promise<BusinessHours> {
        return await this.businessHoursService.updateBusinessHoursByDayOfWeek(day_of_week, updateBusinessHoursPayload);
    }

    @Roles(Role.ADMIN)
    @Put('close/:day_of_week')
    @ApiOperation({ summary: 'Close business hours for a specific day of the week' })
    async closeDay(@Param('day_of_week') day_of_week: DayOfWeekEnum): Promise<BusinessHours> {
        return await this.businessHoursService.closeBusinessDayByDayOfWeek(day_of_week);
    }

    @Roles(Role.ADMIN)
    @Put('open/:day_of_week')
    @ApiOperation({ summary: 'Open business hours for a specific day of the week with default hours' })
    async openDay(@Param('day_of_week') day_of_week: DayOfWeekEnum): Promise<BusinessHours> {
        return await this.businessHoursService.openBusinessDayByDayOfWeek(day_of_week);
    }
}
