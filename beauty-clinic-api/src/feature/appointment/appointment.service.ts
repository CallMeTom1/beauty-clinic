import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Appointment } from './data/entity';
import { BusinessHours } from '../business-hours/data/entity/business-hours.entity';
import { Holiday } from '../holiday/data/entity/holiday.entity';
import { CreateAppointmentPayload } from './data/payload';
import { Care } from '@feature/care/data';
import { ulid } from 'ulid';
import {
    AppointmentConflictException,
    AppointmentDateException,
    AppointmentNotFoundException,
    BusinessHoursConflictException,
    CreateAppointmentException,
    HolidayConflictException,
    UpdateAppointmentStatusException,
} from './appointment.exception';
import { UpdateAppointmentStatusPayload } from './data/payload';
import { CareStatus } from './data/status.enum';
import { User } from '@feature/user/model';
import { CareNotFoundException } from '@feature/care/care.exception';
import { UserNotFoundException } from '@feature/security/security.exception';
import { Between, In } from 'typeorm';
import { GetAvailableDaysPayload } from './data/payload';
import { DayOfWeekEnum } from '../business-hours/data/day-of-week.enum';

@Injectable()
export class AppointmentService {
    constructor(
        @InjectRepository(Appointment)
        private readonly appointmentRepository: Repository<Appointment>,

        @InjectRepository(BusinessHours)
        private readonly businessHoursRepository: Repository<BusinessHours>,

        @InjectRepository(Holiday)
        private readonly holidayRepository: Repository<Holiday>,

        @InjectRepository(Care)
        private readonly careRepository: Repository<Care>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async createAppointment(createAppointmentPayload: CreateAppointmentPayload, user_id: string): Promise<Appointment> {
        const { care_id, start_time, end_time, status, notes } = createAppointmentPayload;

        try {
            const appointmentStartTime: Date = new Date(start_time);
            const appointmentEndTime: Date = new Date(end_time);

            // Validate timing
            await this.validateAppointmentTiming(appointmentStartTime, appointmentEndTime);

            // Check business hours and holidays
            await this.checkBusinessHours(appointmentStartTime, appointmentEndTime);
            await this.checkHolidays(appointmentStartTime);

            // Check for scheduling conflicts
            await this.checkAppointmentConflicts(user_id, care_id, appointmentStartTime, appointmentEndTime);

            // Find care and user
            const care: Care = await this.careRepository.findOne({ where: { care_id } });
            if (!care) throw new CareNotFoundException();

            const user: User = await this.userRepository.findOne({ where: { idUser: user_id } });
            if (!user) throw new UserNotFoundException();

            // Create and save the new appointment
            const newAppointment: Appointment = new Appointment();
            newAppointment.appointment_id = ulid();
            newAppointment.care = care;
            newAppointment.user = user;
            newAppointment.start_time = appointmentStartTime;
            newAppointment.end_time = appointmentEndTime;
            newAppointment.status = status;
            newAppointment.notes = notes;

            await this.appointmentRepository.save(newAppointment);
            return newAppointment;
        } catch (e) {
            throw new CreateAppointmentException();
        }
    }

    async updateAppointmentStatus(payload: UpdateAppointmentStatusPayload): Promise<Appointment> {
        const { appointment_id, status } = payload;

        try {
            // Find the appointment using the provided ID
            const appointment: Appointment = await this.appointmentRepository.findOne({ where: { appointment_id } });
            if (!appointment) {
                throw new AppointmentNotFoundException();
            }

            // Update the appointment status
            appointment.status = status;

            // Save the changes in the database
            await this.appointmentRepository.save(appointment);
            return appointment;
        } catch (e) {
            throw new UpdateAppointmentStatusException();
        }
    }

    async getAvailableTimeSlots(dayOfWeek: DayOfWeekEnum, careId: string, date: Date): Promise<string[]> {
        // Fetch the Care object
        const care: Care = await this.careRepository.findOne({ where: { care_id: careId } });
        if (!care) {
            throw new CareNotFoundException();
        }

        // Define the start and end of the day
        const dayStart: Date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
        const dayEnd: Date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);

        // Fetch all relevant appointments for the care on the specified day
        const appointments: Appointment[] = await this.appointmentRepository.find({
            where: {
                care: care,
                start_time: MoreThanOrEqual(dayStart),
                end_time: LessThanOrEqual(dayEnd),
                status: In([CareStatus.CONFIRMED, CareStatus.PENDING]),
            },
        });

        // Fetch business hours for the specified day of the week
        const businessHours: BusinessHours = await this.businessHoursRepository.findOne({ where: { day_of_week: dayOfWeek } });
        if (!businessHours || !businessHours.is_open) {
            throw new BusinessHoursConflictException();
        }

        // Convert opening and closing times to Date objects for comparison
        const openingTime: Date = new Date(`1970-01-01T${businessHours.opening_time}`);
        const closingTime: Date = new Date(`1970-01-01T${businessHours.closing_time}`);

        // Calculate available time slots
        const availableSlots: string[] = [];
        let slotStartTime: Date = new Date(dayStart);
        slotStartTime.setHours(openingTime.getHours(), openingTime.getMinutes(), openingTime.getSeconds());

        while (slotStartTime < closingTime) {
            let slotEndTime: Date = new Date(slotStartTime);
            slotEndTime.setMinutes(slotEndTime.getMinutes() + care.duration); // Assuming duration is in minutes

            const isOverlapping: boolean = appointments.some(
                (appointment) =>
                    slotStartTime < appointment.end_time && slotEndTime > appointment.start_time
            );

            if (!isOverlapping && slotEndTime <= closingTime) {
                availableSlots.push(
                    `${slotStartTime.toLocaleTimeString('en-US')} - ${slotEndTime.toLocaleTimeString('en-US')}`
                );
            }

            slotStartTime.setMinutes(slotStartTime.getMinutes() + care.duration);
        }

        return availableSlots;
    }

    async findAllAppointments(): Promise<Appointment[]> {
        return await this.appointmentRepository.find();
    }

    async cancelAppointment(appointmentId: string): Promise<Appointment> {
        const appointment: Appointment = await this.appointmentRepository.findOne({ where: { appointment_id: appointmentId } });
        if (!appointment) {
            throw new AppointmentNotFoundException();
        }
        appointment.status = CareStatus.CANCELLED;
        await this.appointmentRepository.save(appointment);
        return appointment;
    }

    private async validateAppointmentTiming(start_time: Date, end_time: Date): Promise<void> {
        const now: Date = new Date();

        if (end_time < start_time) {
            throw new AppointmentDateException();
        }

        if (start_time < now || end_time < now) {
            throw new AppointmentDateException();
        }
    }

    async getAvailableDays(payload: GetAvailableDaysPayload): Promise<Date[]> {
        const { month, year } = payload;
        const startDate: Date = new Date(year, month - 1, 1);
        const endDate: Date = new Date(year, month, 0);

        const holidays: Holiday[] = await this.holidayRepository.find({
            where: {
                holiday_date: Between(startDate, endDate),
            },
        });

        const availableDays: Date[] = [];
        for (let day = new Date(startDate); day <= endDate; day.setDate(day.getDate() + 1)) {
            const formattedDay: Date = new Date(day);
            const dayOfWeek: number = formattedDay.getDay(); // Get day as a number (0-6)

            // Check if it's a holiday
            const isHoliday: boolean = holidays.some(
                (holiday) => holiday.holiday_date.toISOString().slice(0, 10) === formattedDay.toISOString().slice(0, 10)
            );

            // Assume business hours include Monday to Friday (dayOfWeek 1-5)
            if (!isHoliday && dayOfWeek >= 1 && dayOfWeek <= 5) {
                availableDays.push(new Date(formattedDay));
            }
        }

        return availableDays;
    }

    private async checkBusinessHours(start_time: Date, end_time: Date): Promise<void> {
        const dayOfWeek: DayOfWeekEnum = start_time.toLocaleDateString('fr-FR', { weekday: 'long' }) as DayOfWeekEnum;
        const businessHours: BusinessHours = await this.businessHoursRepository.findOne({ where: { day_of_week: dayOfWeek } });

        if (!businessHours || !businessHours.is_open) {
            throw new BusinessHoursConflictException();
        }

        this.validateBusinessHours(businessHours, start_time, end_time);
    }

    private async checkHolidays(date: Date): Promise<void> {
        const holidays: Holiday[] = await this.holidayRepository.find();
        const isHoliday: boolean = holidays.some(
            (holiday) => holiday.holiday_date.toDateString() === date.toDateString()
        );

        if (isHoliday) {
            throw new HolidayConflictException();
        }
    }

    private validateBusinessHours(businessHour: BusinessHours, start_time: Date, end_time: Date): void {
        const openingTime: Date = new Date(`1970-01-01T${businessHour.opening_time}`);
        const closingTime: Date = new Date(`1970-01-01T${businessHour.closing_time}`);
        if (start_time < openingTime || end_time > closingTime) {
            throw new BusinessHoursConflictException();
        }
    }

    private async checkAppointmentConflicts(user_id: string, care_id: string, start_time: Date, end_time: Date): Promise<void> {
        const existingAppointments: Appointment[] = await this.appointmentRepository.find({
            where: [
                {
                    care: { care_id } as Care,
                    user: { idUser: user_id } as User,
                    start_time: LessThanOrEqual(end_time),
                    end_time: MoreThanOrEqual(start_time),
                    status: In([CareStatus.CONFIRMED, CareStatus.PENDING]),
                },
            ],
        });

        if (existingAppointments.length > 0) {
            throw new AppointmentConflictException();
        }
    }
}

