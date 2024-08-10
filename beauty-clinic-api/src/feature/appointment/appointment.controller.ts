import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    Delete, Query, ParseUUIDPipe, BadRequestException
} from '@nestjs/common';
import {ApiTags, ApiOperation, ApiQuery} from '@nestjs/swagger';
import { AppointmentService } from './appointment.service';
import { Appointment } from './data/entity/appointment.entity';
import { CreateAppointmentPayload } from './data/payload/create-appointment.payload';
import { UpdateAppointmentStatusPayload } from './data/payload/modify-appointment-status.payload';
import {Public, Roles, UserReq, UserRequest} from '@common/config/metadata';
import { Role } from '@feature/security/data';
import {GetAvailableDaysPayload} from "./data/payload/get-available-days.payload";
import {getDayOfWeekEnum} from "./appointment.helper";

@ApiTags('Appointment')
@Controller('appointment')
export class AppointmentController {
    constructor(private readonly appointmentService: AppointmentService) {}

    @Public()
    @Get()
    @ApiOperation({ summary: 'Get all appointments' })
    async findAll(): Promise<Appointment[]> {
        return await this.appointmentService.findAllAppointments();
    }

    @Roles(Role.USER, Role.ADMIN)
    @Post()
    @ApiOperation({ summary: 'Create a new appointment' })
    async create(@UserReq() userReq: UserRequest,
        @Body() createAppointmentPayload: CreateAppointmentPayload
    ): Promise<Appointment> {
        return await this.appointmentService.createAppointment(createAppointmentPayload, userReq.idUser);
    }

    @Roles(Role.USER, Role.ADMIN)
    @Put(':appointment_id')
    @ApiOperation({ summary: 'Update an appointment status' })
    async updateStatus(
        @Param('appointment_id') appointment_id: string,
        @Body() updateAppointmentStatusPayload: UpdateAppointmentStatusPayload
    ): Promise<Appointment> {
        return await this.appointmentService.updateAppointmentStatus(updateAppointmentStatusPayload);
    }

    @Roles(Role.ADMIN)
    @Delete(':appointment_id')
    @ApiOperation({ summary: 'Cancel an appointment' })
    async cancel(
        @Param('appointment_id') appointment_id: string
    ): Promise<Appointment> {
        return await this.appointmentService.cancelAppointment(appointment_id);
    }

    @Get('available-days')
    @ApiOperation({ summary: 'Get available days for appointments' })
    @ApiQuery({ name: 'month', description: 'The month for which to fetch available days', type: Number })
    @ApiQuery({ name: 'year', description: 'The year for which to fetch available days', type: Number })
    async getAvailableDays(
        @Query() payload: GetAvailableDaysPayload
    ): Promise<Date[]> {
        return await this.appointmentService.getAvailableDays(payload);
    }

    @Roles(Role.USER, Role.ADMIN)
    @Get('available-times')
    @ApiOperation({ summary: 'Get available time slots for a specific day and care' })
    @ApiQuery({ name: 'date', description: 'The date for which to fetch available time slots', type: String, example: '2024-10-20' })
    @ApiQuery({ name: 'careId', description: 'The care ID for which to fetch available time slots', type: String })
    async getAvailableTimeSlots(
        @Query('date') dateString: string,
        @Query('careId', ParseUUIDPipe) careId: string
    ): Promise<string[]> {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            throw new BadRequestException('Invalid date format provided.');
        }

        const dayOfWeek = getDayOfWeekEnum(date.getDay());
        return await this.appointmentService.getAvailableTimeSlots(dayOfWeek, careId, date);
    }



}
