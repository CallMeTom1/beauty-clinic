import { Module } from '@nestjs/common';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Care} from "@feature/care/data";
import {Appointment} from "./data/entity/appointment.entity";
import {User} from "@feature/user/model";
import {BusinessHours} from "../business-hours/data/entity/business-hours.entity";
import {Holiday} from "../holiday/data/entity/holiday.entity";
import {BusinessHoursService} from "../business-hours/business-hours.service";
import {HolidayService} from "../holiday/holiday.service";
import {UserService} from "@feature/user/user.service";
import {UserModule} from "@feature/user/user.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment, BusinessHours, Holiday, Care, User]),
      UserModule
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService, BusinessHoursService, HolidayService]
})
export class AppointmentModule {}
