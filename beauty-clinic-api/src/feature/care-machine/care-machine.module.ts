import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CareMachineController} from './care-machine.controller';
import {CareMachineService} from './care-machine.service';
import {CareMachine} from "./data/model/care-machine.entity";

@Module({
    imports: [TypeOrmModule.forFeature([CareMachine])],
    controllers: [CareMachineController],
    providers: [CareMachineService],
    exports: [CareMachineService]
})
export class CareMachineModule {}