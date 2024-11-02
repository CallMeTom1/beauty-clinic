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
import {
    CreateAppointmentAdminUserDoesNotExistPayload
} from "./data/payload/create-appointment-admin-user-does-not-exist.payload";
import {UpdateAppointmentNotePayload} from "./data/payload/appointment-edit-note.payload";

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

    /*
    @Roles(Role.ADMIN)
    @Post('admin-create-appointment')
    @ApiOperation({ summary: 'Create an appointment for a user that does not exist' })
    async createAppointmentAdminUserDoesNotExist(
        @Body() createAppointmentPayload: CreateAppointmentAdminUserDoesNotExistPayload
    ): Promise<void> {
        return await this.appointmentService.createAppointmentAdminUserDoesNotExist(createAppointmentPayload);
    }

     */

    @Roles(Role.ADMIN)
    @Put('update-note')
    @ApiOperation({ summary: 'Update the note of an existing appointment' })
    async updateAppointmentNote(
        @Body() payload: UpdateAppointmentNotePayload
    ): Promise<Appointment> {
        return await this.appointmentService.updateAppointmentNote(payload);
    }

    @Roles(Role.ADMIN)
    @Put('confirm')
    @ApiOperation({ summary: 'Confirm an appointment' })
    async confirmAppointment(
        @Body() payload: UpdateAppointmentStatusPayload
    ): Promise<Appointment> {
        return await this.appointmentService.confirmAppointment(payload);
    }

    @Roles(Role.ADMIN)
    @Put('cancel')
    @ApiOperation({ summary: 'Cancel an appointment' })
    async cancelAppointment(
        @Body() payload: UpdateAppointmentStatusPayload
    ): Promise<Appointment> {
        return await this.appointmentService.cancelAppointment(payload);
    }

    @Post('available-days')
    @ApiOperation({ summary: 'Get available days for appointments' })
    async getAvailableDays(
        @Body() payload: GetAvailableDaysPayload
    ): Promise<Date[]> {
        return await this.appointmentService.getAvailableDays(payload);
    }

    @Post('available-slots')
    @ApiOperation({ summary: 'Get available time slots for a specific care, date, and user' })
    async getAvailableTimeSlots(
        @UserReq() userReq: UserRequest,
        @Body() payload: GetAvailableTimeSlotsPayload
    ): Promise<string[]> {
        return this.appointmentService.getAvailableTimeSlots(userReq.idUser, payload);
    }

    // New endpoint to get appointments for a specific user
    @Roles(Role.USER, Role.ADMIN)
    @Get('user-appointments')
    @ApiOperation({ summary: 'Get appointments for the logged-in user' })
    async getAppointmentsByUser(@UserReq() userReq: UserRequest): Promise<Appointment[]> {
        return await this.appointmentService.getAppointmentsByUser(userReq.idUser);
    }

}
