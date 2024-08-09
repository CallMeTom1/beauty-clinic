import { Module } from '@nestjs/common';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Care} from "@feature/care/data";
import {Appointment} from "./data/entity/appointment.entity";
import {User} from "@feature/user/model";
import {BusinessHours} from "./data/entity/business-hours.entity";
import {Holiday} from "./data/entity/holiday.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment, BusinessHours, Holiday, Care, User]),
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService]
})
export class AppointmentModule {}
