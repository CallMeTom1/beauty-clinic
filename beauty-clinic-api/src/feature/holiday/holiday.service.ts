import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Holiday } from './data/entity/holiday.entity';
import { CreateHolidayPayload } from './data/payload/create-holiday.payload';
import {ulid} from "ulid";
import {DeleteHolidayPayload} from "./data/payload/delete-holiday.payload";
import {
    HolidayAlreadyExistException,
    HolidayBadDateException,
    HolidayCreateException,
    HolidayNotDateException
} from "./holiday.exception";
import {CreateHolidayIntervalPayload} from "./data/payload/create-holiday-interval.payload";

@Injectable()
export class HolidayService {
    constructor(
        @InjectRepository(Holiday)
        private readonly holidayRepository: Repository<Holiday>,
    ) {}

    async createHoliday(createHolidayPayload: CreateHolidayPayload): Promise<Holiday> {
        try {
            const holidayDate: Date = new Date(createHolidayPayload.holiday_date);

            if (isNaN(holidayDate.getTime())) {
                throw new HolidayNotDateException();
            }

            const existingHoliday: Holiday = await this.holidayRepository.findOne({
                where: { holiday_date: holidayDate }
            });

            if (existingHoliday) {
                throw new HolidayAlreadyExistException();
            }

            const newHoliday: Holiday = this.holidayRepository.create({
                holiday_id: ulid(),
                holiday_date: holidayDate
            });

            return await this.holidayRepository.save(newHoliday);
        } catch (error) {
            if (error instanceof HolidayAlreadyExistException || error instanceof HolidayNotDateException) {
                throw error;
            } else {
                throw new HolidayCreateException();
            }
        }
    }

    async findAll(): Promise<Holiday[]> {
        return await this.holidayRepository.find();
    }

    async removeByDate(payload: DeleteHolidayPayload): Promise<void> {
        const holidayDate: Date = new Date(payload.holiday_date);

        const result = await this.holidayRepository.delete({ holiday_date: holidayDate });
        if (result.affected === 0) {
            throw new NotFoundException(`Holiday on date ${holidayDate.toISOString().split('T')[0]} not found`);
        }
    }

    async createHolidayInterval(payload: CreateHolidayIntervalPayload): Promise<Holiday[]> {
        const startDate: Date = new Date(payload.start_date);
        const endDate: Date = new Date(payload.end_date);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            throw new HolidayNotDateException();
        }

        if (startDate > endDate) {
            throw new HolidayBadDateException();
        }

        let currentDate: Date = new Date(startDate);
        const holidaysToAdd: Holiday[] = [];

        while (currentDate <= endDate) {
            const existingHoliday: Holiday = await this.holidayRepository.findOne({
                where: { holiday_date: currentDate }
            });

            if (!existingHoliday) {
                const newHoliday: Holiday = this.holidayRepository.create({
                    holiday_id: ulid(),
                    holiday_date: new Date(currentDate)
                });
                holidaysToAdd.push(newHoliday);
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }

        if (holidaysToAdd.length > 0) {
            await this.holidayRepository.save(holidaysToAdd);
        }

        return holidaysToAdd;
    }
}
