import {CanActivateFn} from "@angular/router";
import {inject} from "@angular/core";
import { SecurityService} from "@feature-security";
import {AppRoutes} from "@shared-routes";
import {environment} from "@env";
import {Role} from "../data/model/user";

export function WalletGuard(): CanActivateFn {
  return (): boolean => {
    const securityService: SecurityService = inject(SecurityService);

    if (securityService.isAuth$()) {
      const userRole: string | null = localStorage.getItem(environment.LOCAL_STORAGE_ROLE);
      if (userRole && userRole !== Role.USER && userRole !== Role.USER_VERIFY_PENDING && userRole !== Role.USER_VERIFY_REJECTED) {
        return true;
      }
    }

    securityService.navigate(AppRoutes.PROFILE);
    return false;
  }
}
