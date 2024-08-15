import {CanActivateFn} from "@angular/router";
import {SecurityService} from "@feature-security";
import {inject} from "@angular/core";
import {AppNode} from "@shared-routes";
import {environment} from "@env";
import {Role} from "../security/data/model/user";

export function AdminGuard(): CanActivateFn {
  return (): boolean => {
    const securityService: SecurityService = inject(SecurityService);

    const storedRole: string | null = localStorage.getItem(environment.LOCAL_STORAGE_ROLE);

    if (storedRole === Role.ADMIN) {
      return true;
    } else {
      securityService.navigate(AppNode.HOME);
      return false;
    }
  }
}
