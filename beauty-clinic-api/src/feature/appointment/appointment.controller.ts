import { Controller } from '@nestjs/common';
import {ApiTags} from "@nestjs/swagger";
import {AppointmentService} from "./appointment.service";

@ApiTags('Appointment')
@Controller('appointment')
export class AppointmentController {
    constructor(private readonly appointmentService: AppointmentService) {

    }
}
