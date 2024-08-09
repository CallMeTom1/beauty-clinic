import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { configManager } from '@common/config';
import {APP_GUARD} from "@nestjs/core";
import {UserModule} from "@feature/user/user.module";
import {SecurityModule} from "@feature/security/security.module";
import {JwtGuard} from "@feature/security/guard";
import {CareModule} from "@feature/care/care.module";
import {AppointmentModule} from "../appointment/appointment.module";
@Module({
  imports: [TypeOrmModule.forRoot(configManager.getTypeOrmConfig()), SecurityModule, UserModule, CareModule, AppointmentModule],
  controllers: [],
  providers: [ {
    provide: APP_GUARD, useClass: JwtGuard
  }],
})
export class AppModule {
}