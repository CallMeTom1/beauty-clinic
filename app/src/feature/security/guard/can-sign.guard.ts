import {inject} from "@angular/core";
import {CanActivateFn} from "@angular/router";
import {SecurityService} from "@feature-security";
import {AppRoutes} from "@shared-routes";

export function CanSignGuard(): CanActivateFn {
  return ():boolean => {
    const securityService: SecurityService = inject(SecurityService);
    if(!securityService.isAuth$())
      return true
    securityService.navigate(AppRoutes.MY_ACCOUNT);
    return false;

  }
}
