import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Appointment } from './data/entity/appointment.entity';
import { BusinessHours } from './data/entity/business-hours.entity';
import { Holiday } from './data/entity/holiday.entity';
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
            // Vérifier les heures d'ouverture et les jours fériés
            const businessHours: BusinessHours[] = await this.businessHoursRepository.find();
            const holidays: Holiday[] = await this.holidayRepository.find();

            const appointmentStartTime: Date = new Date(start_time);
            const appointmentEndTime: Date = new Date(end_time);

            const now: Date = new Date();
            if (appointmentStartTime < now || appointmentEndTime < now) {
                throw new AppointmentDateException();
            }

            const dayOfWeek: string = appointmentStartTime.toLocaleDateString('fr-FR', { weekday: 'long' });
            const businessHour: BusinessHours = businessHours.find(bh => bh.day_of_week === dayOfWeek);
            const isHoliday: boolean = holidays.some(holiday => holiday.holiday_date.toDateString() === appointmentStartTime.toDateString());

            if (isHoliday) {
                throw new HolidayConflictException();
            }

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
}
