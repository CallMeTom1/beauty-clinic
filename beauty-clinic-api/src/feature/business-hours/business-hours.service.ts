import {Injectable, OnModuleInit} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {BusinessHours, UpdateBusinessHoursPayload} from "@feature/business-hours/data";
import {Repository} from "typeorm";
import {DayOfWeekEnum} from "@feature/business-hours/day-of-week.enum";
import {ulid} from "ulid";
import {
    BusinessHoursCloseException,
    BusinessHoursInitException, BusinessHoursNotFoundException, BusinessHoursOpenException,
    BusinessHoursUpdateException
} from "@feature/business-hours/business-hours.exception";


@Injectable()
export class BusinessHoursService implements OnModuleInit {
    constructor(
        @InjectRepository(BusinessHours)
        private readonly businessHoursRepository: Repository<BusinessHours>,
    ) {}

    async onModuleInit(): Promise<void> {
        await this.initializeDefaultBusinessHours();
    }

    private async initializeDefaultBusinessHours(): Promise<void> {

        try{
            const daysOfWeek: DayOfWeekEnum[] = Object.values(DayOfWeekEnum);

            for (const day of daysOfWeek) {
                const existingBusinessHours: BusinessHours = await this.businessHoursRepository.findOne({ where: { day_of_week: day } });
                if (!existingBusinessHours) {
                    const newBusinessHours: BusinessHours = this.businessHoursRepository.create({
                        businessHours_id: ulid(),
                        day_of_week: day,
                        opening_time: '09:00',  // Default opening time
                        closing_time: '17:00',  // Default closing time
                        is_open: true,
                    });
                    await this.businessHoursRepository.save(newBusinessHours);
                }
            }
        }
        catch(e){
            throw new BusinessHoursInitException();
        }

    }

    async updateBusinessHoursByDayOfWeek(day_of_week: DayOfWeekEnum, updateBusinessHoursPayload: UpdateBusinessHoursPayload):
        Promise<BusinessHours> {
        try{
            let businessHours: BusinessHours = await this.businessHoursRepository.findOne({ where: { day_of_week } });

            if (!businessHours) {
                throw new Error();
            }

            businessHours.opening_time = updateBusinessHoursPayload.opening_time;
            businessHours.closing_time = updateBusinessHoursPayload.closing_time;
            businessHours.is_open = updateBusinessHoursPayload.is_open;

            if (businessHours.opening_time && businessHours.closing_time && businessHours.closing_time < businessHours.opening_time) {
                throw new Error();
            }

            return await this.businessHoursRepository.save(businessHours);
        }
        catch(e){
            throw new BusinessHoursUpdateException();
        }

    }

    async closeBusinessDayByDayOfWeek(day_of_week: DayOfWeekEnum): Promise<BusinessHours> {
        try{
            const businessHours: BusinessHours = await this.businessHoursRepository.findOne({ where: { day_of_week } });
            if (!businessHours) {
                throw new Error();
            }

            businessHours.is_open = false;
            businessHours.opening_time = null;
            businessHours.closing_time = null;

            return await this.businessHoursRepository.save(businessHours);
        }
        catch(e){
            throw new BusinessHoursCloseException();
        }

    }

    async openBusinessDayByDayOfWeek(day_of_week: DayOfWeekEnum): Promise<BusinessHours> {
        try{
            const businessHours: BusinessHours = await this.businessHoursRepository.findOne({ where: { day_of_week } });
            if (!businessHours) {
                throw new Error();
            }

            businessHours.is_open = true;
            businessHours.opening_time = '09:00';  // Default opening time
            businessHours.closing_time = '17:00';  // Default closing time

            return await this.businessHoursRepository.save(businessHours);
        }
        catch(e){
            throw new BusinessHoursOpenException();
        }

    }

    async findAllBusinessHours(): Promise<BusinessHours[]> {
        try{
            return await this.businessHoursRepository.find();
        }
        catch (e){
            throw new BusinessHoursNotFoundException();
        }
    }
}
