import {Injectable, Logger} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Between, In, LessThanOrEqual, MoreThanOrEqual, Repository} from 'typeorm';
import {ulid} from 'ulid';
import {Appointment} from './data/entity';
import {BusinessHours} from '@feature/business-hours/data';
import {Holiday} from '../holiday/data/entity/holiday.entity';
import {Care} from '@feature/care/data';
import {User} from '@feature/user/model';

import {
    CreateAppointmentPayload,
    GetAvailableDaysPayload,
    GetAvailableTimeSlotsPayload,
    UpdateAppointmentStatusPayload
} from './data/payload';
import {AppointmentStatus} from './data/appointment-status.enum';
import {DayOfWeekEnum} from '../business-hours/day-of-week.enum';

import {
    AppointmentConflictException,
    AppointmentDateException,
    AppointmentNotFoundException,
    BusinessHoursConflictException,
    CreateAppointmentException,
    HolidayConflictException,
    UpdateAppointmentStatusException,
} from './appointment.exception';
import {CareNotFoundException} from '@feature/care/care.exception';
import {UserNotFoundException} from '@feature/security/security.exception';
import {UserService} from "@feature/user/user.service";
import {
    CreateAppointmentAdminUserDoesNotExistPayload
} from "./data/payload/create-appointment-admin-user-does-not-exist.payload";
import {UpdateAppointmentNotePayload} from "./data/payload/appointment-edit-note.payload";

@Injectable()
export class AppointmentService {
    logger: Logger = new Logger('AppointmentService');

    constructor(
        private readonly userService: UserService,
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

    async createAppointmentAdminUserDoesNotExist(payload: CreateAppointmentAdminUserDoesNotExistPayload): Promise<void> {
        const { firstname, lastname, phoneNumber, care_id, start_time } = payload;

        try {
            // 1. Créer un nouvel utilisateur
            const newUser = await this.userService.createUser({ firstname, lastname, phoneNumber });
            this.logger.log(`User created: ${JSON.stringify(newUser)}`);

            // 2. Trouver le soin correspondant
            const care = await this.careRepository.findOne({ where: { care_id } });
            if (!care) {
                throw new CareNotFoundException();
            }

            // 3. Calculer l'heure de fin du rendez-vous
            const appointmentStartTime = new Date(start_time);
            const appointmentEndTime = new Date(appointmentStartTime.getTime() + care.duration * 60 * 1000);

            // 4. Créer le rendez-vous pour l'utilisateur
            const newAppointment = this.appointmentRepository.create({
                appointment_id: ulid(),
                care: care,
                user: newUser,
                start_time: this.formatDateTime(appointmentStartTime),
                end_time: this.formatDateTime(appointmentEndTime),
                status: AppointmentStatus.PENDING,
                notes: 'Rendez-vous créé par l\'administrateur.',
            });

            // 5. Sauvegarder le rendez-vous
            await this.appointmentRepository.save(newAppointment);
            this.logger.log('Appointment successfully created.');

        } catch (error) {
            this.logger.error(`Error creating appointment: ${error.message}`, error.stack);
            throw new CreateAppointmentException();
        }
    }

    async updateAppointmentNote(payload: UpdateAppointmentNotePayload): Promise<Appointment> {
        const { appointment_id, note } = payload;
        const appointment = await this.appointmentRepository.findOne({ where: { appointment_id } });

        if (!appointment) {
            this.logger.error(`Appointment not found with ID: ${appointment_id}`);
            throw new AppointmentNotFoundException();
        }

        appointment.notes = note;
        await this.appointmentRepository.save(appointment);
        this.logger.log(`Updated appointment note for ID: ${appointment_id}`);

        return appointment;
    }

    async createAppointment(createAppointmentPayload: CreateAppointmentPayload, userId: string): Promise<void> {
        this.logger.log(`Starting createAppointment with payload: ${JSON.stringify(createAppointmentPayload)} for user: ${userId}`);
        let { care_id, start_time } = createAppointmentPayload;

        const appointmentStartTime = new Date(start_time);
        this.logger.log(`Appointment start time: ${appointmentStartTime}`);

        try {
            const care = await this.careRepository.findOne({ where: { care_id } });
            this.logger.log(`Care found: ${JSON.stringify(care)}`);
            if (!care) throw new CareNotFoundException();

            const appointmentEndTime = new Date(appointmentStartTime.getTime() + care.duration * 60 * 1000);
            this.logger.log(`Calculated end time: ${appointmentEndTime}`);

            const start_time_str = this.formatDateTime(appointmentStartTime);
            const end_time_str = this.formatDateTime(appointmentEndTime);
            this.logger.log(`Formatted start time: ${start_time_str}, end time: ${end_time_str}`);

            const payload: GetAvailableTimeSlotsPayload = {careId: care_id, date:appointmentStartTime.toDateString()}

            const availableSlots = await this.getAvailableTimeSlots(userId, payload);
            this.logger.log(`Available slots: ${JSON.stringify(availableSlots)}`);

            const selectedSlot = `${start_time_str} - ${end_time_str}`;
            this.logger.log(`Selected slot: ${selectedSlot}`);
            if (!availableSlots.includes(selectedSlot)) {
                this.logger.warn(`Selected slot not in available slots`);
                throw new AppointmentConflictException();
            }

            await this.validateAppointmentTiming(start_time_str, end_time_str);
            this.logger.log('Appointment timing validated');

            await this.checkBusinessHours(start_time_str, end_time_str);
            this.logger.log('Business hours checked');

            await this.checkHolidays(start_time_str);
            this.logger.log('Holidays checked');

            await this.checkAppointmentConflicts(userId, care_id, start_time_str, end_time_str);
            this.logger.log('Appointment conflicts checked');

            const user = await this.userRepository.findOne({ where: { idUser: userId } });
            this.logger.log(`User found: ${JSON.stringify(user)}`);
            if (!user) throw new UserNotFoundException();

            const newAppointment: Appointment = this.appointmentRepository.create({
                appointment_id: ulid(),
                care,
                user,
                start_time: start_time_str,
                end_time: end_time_str,
                status: AppointmentStatus.PENDING,
                notes: 'Votre rendez-vous est en attente de confirmation par Françoise',
            });
            this.logger.log(`New appointment created: ${JSON.stringify(newAppointment)}`);

            await this.appointmentRepository.save(newAppointment);
            this.logger.log('Appointment saved successfully');

        } catch (e) {
            this.logger.error(`Error creating appointment: ${e.message}`, e.stack);
            throw new CreateAppointmentException();
        }
    }


    // Logic to confirm an appointment
    async confirmAppointment(payload: UpdateAppointmentStatusPayload): Promise<Appointment> {
        const { appointment_id } = payload;

        try {
            const appointment = await this.appointmentRepository.findOne({ where: { appointment_id } });
            if (!appointment) {
                throw new AppointmentNotFoundException();
            }

            appointment.status = AppointmentStatus.CONFIRMED;

            // Add any future business logic related to confirmation here

            return await this.appointmentRepository.save(appointment);
        } catch (e) {
            throw new UpdateAppointmentStatusException();
        }
    }

    // Logic to cancel an appointment
    async cancelAppointment(payload: UpdateAppointmentStatusPayload): Promise<Appointment> {
        const { appointment_id } = payload;

        try {
            const appointment = await this.appointmentRepository.findOne({ where: { appointment_id } });
            if (!appointment) {
                throw new AppointmentNotFoundException();
            }

            appointment.status = AppointmentStatus.CANCELLED;

            // Add any future business logic related to cancellation here

            return await this.appointmentRepository.save(appointment);
        } catch (e) {
            throw new UpdateAppointmentStatusException();
        }
    }

    async findAllAppointments(): Promise<Appointment[]> {
        try {
            // Fetch all appointments and include user and care details
            return await this.appointmentRepository.find({
                relations: ['user', 'care'], // Include user and care details in the results
                select: {
                    user: {
                        firstname: true, // Select only the firstname
                        lastname: true  // Select only the lastname
                    },
                    care: {
                        name: true, // Select only the name of the care
                        price: true
                    }
                }
            });
        } catch (error) {
            this.logger.error(`Error fetching all appointments: ${error.message}`, error.stack);
            throw new AppointmentNotFoundException();
        }
    }



    async getAvailableDays(payload: GetAvailableDaysPayload): Promise<Date[]> {
        const { month, year } = payload;
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        const holidays = await this.holidayRepository.find({
            where: { holiday_date: Between(startDate, endDate) },
        });

        const availableDays: Date[] = [];
        for (let day = new Date(startDate); day <= endDate; day.setDate(day.getDate() + 1)) {
            const formattedDay = new Date(day);
            const dayOfWeek = formattedDay.getDay();

            const isHoliday = holidays.some(
                (holiday) => holiday.holiday_date.toISOString().slice(0, 10) === formattedDay.toISOString().slice(0, 10)
            );

            if (!isHoliday && dayOfWeek >= 1 && dayOfWeek <= 5) {
                availableDays.push(new Date(formattedDay));
            }
        }

        return availableDays;
    }

    async getAvailableTimeSlots(userId: string, payload: GetAvailableTimeSlotsPayload): Promise<string[]> {
        try {
            const {careId, date} = payload

            const date_date = new Date(date);
            // careId: string, date: Date
            const care: Care = await this.careRepository.findOne({ where: { care_id: careId } });
            if (!care) {
                throw new CareNotFoundException();
            }

            // Validate minimum time between appointments
            await this.validateTimeBetweenAppointments(userId, payload.careId, date_date);

            const dayOfWeek = this.getDayOfWeek(date_date);
            const businessHours = await this.getBusinessHours(dayOfWeek);
            if (!businessHours || !businessHours.is_open) {
                return [];
            }

            const isHoliday = await this.isHoliday(date_date);
            if (isHoliday) {
                return [];
            }

            const existingAppointments = await this.getExistingAppointments(date_date, businessHours);

            return this.generateAvailableSlots(date_date, businessHours, care.duration, existingAppointments);
        } catch (error) {
            this.logger.error(`Error getting available time slots: ${error.message}`, error.stack);
            // Returning an empty array if there's an error to ensure the API remains usable
            return [];
        }
    }


    private async validateAppointmentTiming(start_time: string, end_time: string): Promise<void> {
        const now = new Date();
        const startTimeDate = new Date(start_time);
        const endTimeDate = new Date(end_time);

        if (endTimeDate <= startTimeDate || startTimeDate < now || endTimeDate < now) {
            throw new AppointmentDateException();
        }
    }

    private async checkBusinessHours(start_time: string, end_time: string): Promise<void> {
        this.logger.log(`Checking business hours for start=${start_time}, end=${end_time}`);
        const startDate = new Date(start_time);
        const dayOfWeek = this.getDayOfWeek(startDate);
        this.logger.log(`Day of week: ${dayOfWeek}`);

        const businessHours = await this.getBusinessHours(dayOfWeek);
        this.logger.log(`Business hours: ${JSON.stringify(businessHours)}`);

        if (!businessHours || !businessHours.is_open) {
            this.logger.warn('Business is closed on this day');
            throw new BusinessHoursConflictException();
        }

        this.validateBusinessHours(businessHours, start_time, end_time);
        this.logger.log('Business hours are valid for the appointment');
    }

    private async checkHolidays(date: string): Promise<void> {
        const isHoliday = await this.isHoliday(new Date(date));
        if (isHoliday) {
            throw new HolidayConflictException();
        }
    }

    private validateBusinessHours(businessHour: BusinessHours, start_time: string, end_time: string): void {
        const startTimeDate = new Date(start_time);
        const endTimeDate = new Date(end_time);

        // Convert opening and closing times into full Date objects for comparison
        const openingTime = this.combineDateAndTime(startTimeDate, businessHour.opening_time);
        const closingTime = this.combineDateAndTime(startTimeDate, businessHour.closing_time);

        if (startTimeDate < openingTime || endTimeDate > closingTime) {
            console.warn('Appointment time is outside business hours');
            throw new BusinessHoursConflictException();
        }
    }

    private async checkAppointmentConflicts(userId: string, careId: string, start_time: string, end_time: string): Promise<void> {
        const existingAppointments = await this.appointmentRepository.find({
            where: [
                {
                    care: { care_id: careId } as Care,
                    user: { idUser: userId } as User,
                    start_time: LessThanOrEqual(end_time),
                    end_time: MoreThanOrEqual(start_time),
                    status: In([AppointmentStatus.CONFIRMED, AppointmentStatus.PENDING]),
                },
            ],
        });

        const conflicts = existingAppointments.some(appointment => {
            return new Date(appointment.start_time) < new Date(end_time) && new Date(appointment.end_time) > new Date(start_time);
        });

        if (conflicts) {
            throw new AppointmentConflictException();
        }
    }

    private getDayOfWeek(date: Date): DayOfWeekEnum {
        const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
        return days[date.getDay()] as DayOfWeekEnum;
    }

    private async getBusinessHours(dayOfWeek: DayOfWeekEnum): Promise<BusinessHours | null> {
        return await this.businessHoursRepository.findOne({ where: { day_of_week: dayOfWeek } });
    }

    private async isHoliday(date: Date): Promise<boolean> {
        const holiday = await this.holidayRepository.findOne({
            where: { holiday_date: Between(date, new Date(date.getTime() + 24 * 60 * 60 * 1000)) }
        });
        return !!holiday;
    }

    private async getExistingAppointments(date: Date, businessHours: BusinessHours): Promise<Appointment[]> {
        const startTimeStr = this.combineDateAndTimeToString(date, businessHours.opening_time);
        const endTimeStr = this.combineDateAndTimeToString(date, businessHours.closing_time);

        return await this.appointmentRepository.find({
            where: {
                start_time: Between(startTimeStr, endTimeStr),
                status: In([AppointmentStatus.CONFIRMED, AppointmentStatus.PENDING]),
            },
        });
    }

    private generateAvailableSlots(
        date: Date,
        businessHours: BusinessHours,
        careDuration: number,
        existingAppointments: Appointment[]
    ): string[] {
        const availableSlots: string[] = [];
        const slotDuration = careDuration * 60 * 1000;

        let currentSlotStart = this.combineDateAndTime(date, businessHours.opening_time);
        const closingTime = this.combineDateAndTime(date, businessHours.closing_time);

        while (currentSlotStart.getTime() + slotDuration <= closingTime.getTime()) {
            const currentSlotEnd = new Date(currentSlotStart.getTime() + slotDuration);

            const currentSlotStartStr = this.formatDateTime(currentSlotStart);
            const currentSlotEndStr = this.formatDateTime(currentSlotEnd);

            const isConflicting = existingAppointments.some(appointment => {
                const apptStart = new Date(appointment.start_time);
                const apptEnd = new Date(appointment.end_time);
                return currentSlotStart < apptEnd && currentSlotEnd > apptStart;
            });

            if (!isConflicting) {
                availableSlots.push(`${currentSlotStartStr} - ${currentSlotEndStr}`);
            }

            currentSlotStart = new Date(currentSlotStart.getTime() + slotDuration);
        }

        return availableSlots;
    }



    private combineDateAndTime(date: Date, time: string): Date {
        const [hours, minutes] = time.split(':').map(Number);
        const combinedDate = new Date(date);
        combinedDate.setHours(hours, minutes, 0, 0);
        return combinedDate;
    }

    private formatTime(date: Date): string {
        return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    }

    private formatDateTime(date: Date): string {
        const year = date.getFullYear();
        const month = (`0${date.getMonth() + 1}`).slice(-2);
        const day = (`0${date.getDate()}`).slice(-2);
        const hours = (`0${date.getHours()}`).slice(-2);
        const minutes = (`0${date.getMinutes()}`).slice(-2);
        const seconds = (`0${date.getSeconds()}`).slice(-2);

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    // Utility function to combine date and time into a string
    private combineDateAndTimeToString(date: Date, time: string): string {
        const [hours, minutes] = time.split(':').map(Number);
        const combinedDate = new Date(date);
        combinedDate.setHours(hours, minutes, 0, 0);
        return this.formatDateTime(combinedDate);
    }

    private async validateTimeBetweenAppointments(userId: string, careId: string, newStartTime: Date): Promise<void> {
        // Fetch the latest appointment of the same care type for this user
        const latestAppointment = await this.appointmentRepository.findOne({
            where: {
                user: { idUser: userId } as User,
                care: { care_id: careId } as Care,
                status: In([AppointmentStatus.CONFIRMED, AppointmentStatus.PENDING]),
            },
            order: {
                end_time: "DESC"
            }
        });

        if (latestAppointment) {
            const care = await this.careRepository.findOne({
                where: { care_id: careId }
            });

            if (!care || care.time_between === null) {
                // If no time between constraint is set, return without error
                return;
            }

            const lastEndTime = new Date(latestAppointment.end_time);
            const requiredInterval = care.time_between * 24 * 60 * 60 * 1000; // Convert days to milliseconds
            const newStartTimeMs = newStartTime.getTime();

            // Check if the new start time is at least the required interval after the last end time
            if (newStartTimeMs - lastEndTime.getTime() < requiredInterval) {
                throw new Error(`A minimum of ${care.time_between} days is required between appointments for this type of care.`);
            }
        }
    }

    async getAppointmentsByUser(userId: string): Promise<Appointment[]> {
        try {
            const appointments = await this.appointmentRepository.find({
                where: { user: { idUser: userId } },
                relations: ['care'],  // Include care details if necessary
                order: { start_time: 'ASC' }  // Sort by appointment start time
            });

            if (!appointments || appointments.length === 0) {
                throw new AppointmentNotFoundException();
            }

            return appointments;
        } catch (error) {
            throw new AppointmentNotFoundException();
        }
    }


}