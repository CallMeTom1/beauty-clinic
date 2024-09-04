import {ApiOperation, ApiTags} from "@nestjs/swagger";
import {Body, Controller, Get, Param, Put} from "@nestjs/common";
import {BusinessHoursService} from "./business-hours.service"
import {Public, Roles} from "@common/config/metadata";
import {BusinessHours, UpdateBusinessHoursPayload} from "@feature/business-hours/data";
import {Role} from "@feature/security/data";
import {DayOfWeekEnum} from "@feature/business-hours/day-of-week.enum";


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
