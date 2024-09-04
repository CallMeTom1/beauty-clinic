import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {BusinessHours} from "@feature/business-hours/data";
import {BusinessHoursService} from "./business-hours.service";
import {BusinessHoursController} from "@feature/business-hours/business-hours.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([BusinessHours])
    ],
    controllers: [BusinessHoursController],
    providers: [BusinessHoursService]
})
export class BusinessHoursModule{}