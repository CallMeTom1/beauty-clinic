import {Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Appointment } from './data/entity/appointment.entity';
import { BusinessHours } from '../business-hours/data/entity/business-hours.entity';
import { Holiday } from '../holiday/data/entity/holiday.entity';
import { CreateAppointmentPayload } from './data/payload/create-appointment.payload';
import { Care } from '@feature/care/data';
import { ulid } from 'ulid';
import {
    AppointmentConflictException,
    AppointmentDateException, AppointmentNotFoundException, BusinessHoursConflictException,
    CreateAppointmentException, HolidayConflictException,
    UpdateAppointmentStatusException
} from './appointment.exception';
import { UpdateAppointmentStatusPayload } from './data/payload/modify-appointment-status.payload';
import { CareStatus } from './data/status.enum';
import {User} from "@feature/user/model";
import {CareNotFoundException} from "@feature/care/care.exception";
import {UserNotFoundException} from "@feature/security/security.exception";
import { Between } from 'typeorm';
import {GetAvailableDaysPayload} from "./data/payload/get-available-days.payload";
import {DayOfWeekEnum} from "../business-hours/data/day-of-week.enum";
import { In } from 'typeorm';

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
            // Récupérer les heures d'ouverture et les jours fériés
            const businessHours: BusinessHours[] = await this.businessHoursRepository.find();
            const holidays: Holiday[] = await this.holidayRepository.find();

            const appointmentStartTime: Date = new Date(start_time);
            const appointmentEndTime: Date = new Date(end_time);

            //vérifier que la date n'est pas antérieure à aujourd'hui
            const now: Date = new Date();
            if (appointmentStartTime < now || appointmentEndTime < now) {
                throw new AppointmentDateException();
            }

            const dayOfWeek: string = appointmentStartTime.toLocaleDateString('fr-FR', { weekday: 'long' });
            const businessHour: BusinessHours = businessHours.find(bh => bh.day_of_week === dayOfWeek);
            const isHoliday: boolean = holidays.some(holiday => holiday.holiday_date.toDateString() === appointmentStartTime.toDateString());

            //vérifier que la date du rdv n'est pas pendant un jour de vacances
            if (isHoliday) {
                throw new HolidayConflictException();
            }

            //vérifier que la date du rdv est pendant les heures d'ouvertures
            if (businessHour) {
                const openingTime: Date = new Date(`1970-01-01T${businessHour.opening_time.toISOString().substring(11, 19)}`);
                const closingTime: Date = new Date(`1970-01-01T${businessHour.closing_time.toISOString().substring(11, 19)}`);
                if (!businessHour.is_open ||
                    appointmentStartTime < openingTime ||
                    appointmentEndTime > closingTime) {
                    throw new BusinessHoursConflictException();
                }
            }

            // Vérifier les chevauchements de rendez-vous, en excluant les rendez-vous annulés
            const existingAppointments: Appointment[] = await this.appointmentRepository.find({
                where: [
                    {
                        care: { care_id } as Care,
                        user: { idUser: user_id } as User,
                        start_time: LessThanOrEqual(appointmentEndTime),
                        end_time: MoreThanOrEqual(appointmentStartTime),
                        status: CareStatus.CONFIRMED,
                    },
                    {
                        care: { care_id } as Care,
                        user: { idUser: user_id } as User,
                        start_time: LessThanOrEqual(appointmentEndTime),
                        end_time: MoreThanOrEqual(appointmentStartTime),
                        status: CareStatus.PENDING,
                    }
                ],
            });

            if (existingAppointments.length > 0) {
                throw new AppointmentConflictException();
            }

            // Trouver le care et l'utilisateur à l'aide des ID fournis
            const care: Care = await this.careRepository.findOne({ where: { care_id } });
            if (!care) {
                throw new CareNotFoundException();
            }

            const user: User = await this.userRepository.findOne({ where: { idUser: user_id } });
            if (!user) {
                throw new UserNotFoundException();
            }

            //todo vérifier pour un soin, pour un client qu'il respecte le temps entre chaque séance

            // Créer un nouvel appointment
            const newAppointment:Appointment = new Appointment();
            newAppointment.appointment_id = ulid(); // Génère un nouvel ID pour l'appointment
            newAppointment.care = care; // Associe le care trouvé
            newAppointment.user = user; // Associe l'utilisateur trouvé
            newAppointment.start_time = appointmentStartTime;
            newAppointment.end_time = appointmentEndTime;
            newAppointment.status = status;
            newAppointment.notes = notes;

            // Enregistrer l'appointment dans la base de données
            await this.appointmentRepository.save(newAppointment);
            return newAppointment;
        } catch (e) {
            throw new CreateAppointmentException();
        }
    }

    async updateAppointmentStatus(payload: UpdateAppointmentStatusPayload): Promise<Appointment> {
        const { appointment_id, status } = payload;

        try {
            // Trouver le rendez-vous à l'aide de l'ID fourni
            const appointment: Appointment = await this.appointmentRepository.findOne({ where: { appointment_id } });
            if (!appointment) {
                throw new AppointmentNotFoundException();
            }

            // Mettre à jour le statut du rendez-vous
            appointment.status = status;

            // Enregistrer les modifications dans la base de données
            await this.appointmentRepository.save(appointment);
            return appointment;
        } catch (e) {
            throw new UpdateAppointmentStatusException();
        }
    }

    async getAvailableDays(payload: GetAvailableDaysPayload): Promise<Date[]> {
        const { month, year } = payload;
        const startDate = new Date(year, month - 1, 1); // Start of the month
        const endDate = new Date(year, month, 0); // End of the month

        const holidays = await this.holidayRepository.find({
            where: {
                holiday_date: Between(startDate, endDate)
            }
        });

        const availableDays = [];
        for (let day = new Date(startDate); day <= endDate; day.setDate(day.getDate() + 1)) {
            const formattedDay = new Date(day);
            const dayOfWeek = formattedDay.getDay(); // Get day as a number (0-6)

            // Check if it's a holiday
            const isHoliday = holidays.some(holiday =>
                holiday.holiday_date.toISOString().slice(0, 10) === formattedDay.toISOString().slice(0, 10)
            );

            // Assume business hours include Monday to Friday (dayOfWeek 1-5)
            if (!isHoliday && dayOfWeek >= 1 && dayOfWeek <= 5) {
                availableDays.push(new Date(formattedDay));
            }
        }

        return availableDays;
    }

    async getAvailableTimeSlots(dayOfWeek: DayOfWeekEnum, careId: string, date: Date): Promise<string[]> {
        // Fetch the Care object
        const care: Care = await this.careRepository.findOne({ where: { care_id: careId } });
        if (!care) {
            throw new CareNotFoundException();
        }

        // Define the start and end of the day
        const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
        const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);

        // Fetch all relevant appointments for the care on the specified day
        const appointments = await this.appointmentRepository.find({
            where: {
                care: care,
                start_time: MoreThanOrEqual(dayStart),
                end_time: LessThanOrEqual(dayEnd),
                status: In([CareStatus.CONFIRMED, CareStatus.PENDING])
            }
        });

        // Proceed with business hour retrieval and slot generation as before
        const businessHours = await this.businessHoursRepository.findOne({ where: { day_of_week: dayOfWeek }});
        if (!businessHours || !businessHours.is_open) {
            throw new BusinessHoursConflictException();
        }

        // Calculate available time slots
        const availableSlots = [];
        let slotStartTime = new Date(dayStart.getTime());
        slotStartTime.setHours(businessHours.opening_time.getHours(), businessHours.opening_time.getMinutes());

        while (slotStartTime < businessHours.closing_time) {
            let slotEndTime = new Date(slotStartTime.getTime());
            slotEndTime.setMinutes(Number(slotEndTime.getMinutes() + care.duration)); // Assuming duration is in minutes

            const isOverlapping = appointments.some(appointment =>
                slotStartTime < appointment.end_time && slotEndTime > appointment.start_time
            );

            if (!isOverlapping && slotEndTime <= businessHours.closing_time) {
                availableSlots.push(`${slotStartTime.toLocaleTimeString('en-US')} - ${slotEndTime.toLocaleTimeString('en-US')}`);
            }

            slotStartTime.setMinutes(Number(slotStartTime.getMinutes() + care.duration));
        }

        return availableSlots;
    }

    async findAllAppointments(): Promise<Appointment[]> {
        return await this.appointmentRepository.find();
    }

    async cancelAppointment(appointmentId: string): Promise<Appointment> {
        const appointment = await this.appointmentRepository.findOne({ where: { appointment_id: appointmentId } });
        if (!appointment) {
            throw new AppointmentNotFoundException();
        }
        appointment.status = CareStatus.CANCELLED;
        await this.appointmentRepository.save(appointment);
        return appointment;
    }

}
