import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { configManager } from '@common/config';
import {APP_GUARD} from "@nestjs/core";
import {UserModule} from "@feature/user/user.module";
import {SecurityModule} from "@feature/security/security.module";
import {JwtGuard} from "@feature/security/guard";
import {CareModule} from "@feature/care/care.module";
import {AppointmentModule} from "../appointment/appointment.module";
import {HolidayModule} from "../holiday/holiday.module";
import {BusinessHoursModule} from "../business-hours/business-hours.module";
import {ProductCategoryModule} from "../product-category/product-category.module";
import {ProductModule} from "../product/product.module";
import {CartModule} from "../cart/cart.module";
import {OrderModule} from "../order/order.module";
import {PaymentModule} from "../payment/payment.module";
import {CareCategoryModule} from "../care-category/care-category.module";
import {CareSubCategoryModule} from "../care-sub-category/care-sub-category.module";
import {BodyZoneModule} from "../body-zone/body-zone.module";
import {PromoCodeModule} from "../promo-code/promo-code.module";
import {CareMachineModule} from "../care-machine/care-machine.module";
import {ReviewModule} from "../review/review.module";
import {WishlistModule} from "../wish-list/wishlist.module";
import {ClinicModule} from "../clinic/clinic.module";
@Module({
  imports: [TypeOrmModule.forRoot(configManager.getTypeOrmConfig()), SecurityModule, UserModule, CareModule,
    AppointmentModule, HolidayModule, BusinessHoursModule, ProductCategoryModule, ProductModule, CartModule, OrderModule,
    PaymentModule, CareCategoryModule, CareSubCategoryModule, BodyZoneModule, PromoCodeModule, CareMachineModule,
    ReviewModule, WishlistModule, ClinicModule],
  controllers: [],
  providers: [ {
    provide: APP_GUARD, useClass: JwtGuard
  }],
})
export class AppModule {
}