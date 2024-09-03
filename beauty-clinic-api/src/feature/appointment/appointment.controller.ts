import {ApiOperation, ApiQuery, ApiTags} from "@nestjs/swagger";
import {Body, Controller, Delete, Get, Param, Post, Put, Query} from "@nestjs/common";
import {AppointmentService} from "./appointment.service";
import {Public, Roles, UserReq, UserRequest} from "@common/config/metadata";
import {Appointment} from "./data/entity";
import {Role} from "@feature/security/data";
import {
    CreateAppointmentPayload,
    GetAvailableDaysPayload,
    GetAvailableTimeSlotsPayload,
    UpdateAppointmentStatusPayload
} from "./data/payload";

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
    ): Promise<void> {
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

    @Get('available-slots')
    @ApiOperation({ summary: 'Get available time slots for a specific care, date, and user' })
    @ApiQuery({ name: 'careId', type: String, description: 'The ID of the care' })
    @ApiQuery({ name: 'date', type: String, description: 'The date for which to fetch available slots' })
    async getAvailableTimeSlots(
        @UserReq() userReq: UserRequest,
        @Query('careId') careId: string,
        @Query('date') date: string
    ): Promise<string[]> {
        return this.appointmentService.getAvailableTimeSlots(userReq.idUser, careId, new Date(date));
    }

}
