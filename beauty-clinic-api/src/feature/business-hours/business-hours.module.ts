import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {BusinessHours} from "./data/entity/business-hours.entity";
import {BusinessHoursController} from "./business-hours.controller";
import {BusinessHoursService} from "./business-hours.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([BusinessHours])
    ],
    controllers: [BusinessHoursController],
    providers: [BusinessHoursService]
})
export class BusinessHoursModule{}