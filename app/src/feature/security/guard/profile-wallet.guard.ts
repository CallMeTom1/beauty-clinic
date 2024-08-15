import {CanActivateFn} from "@angular/router";
import {inject} from "@angular/core";
import {SecurityService} from "@feature-security";
import {AppRoutes} from "@shared-routes";

export function ProfileAndWalletGuard(): CanActivateFn {
  return ():boolean => {
    const securityService: SecurityService = inject(SecurityService);
    if(securityService.isAuth$())
      return true
    securityService.navigate(AppRoutes.SIGNIN);
    return false;
  }
}
