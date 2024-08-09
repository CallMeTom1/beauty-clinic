import { JwtService } from '@nestjs/jwt';
import {catchError, from, Observable} from 'rxjs';
import { Reflector } from '@nestjs/core';
import { map } from 'rxjs/operators';
import { SecurityService } from "@feature/security/service/security.service";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import {Credential, Role, ROLES_KEY} from "@feature/security/data";
import {
    NoTokenFoundedException,
    TokenExpiredException,
    TokenIsNotStringException,
    UserInsucfficientRoleException,
    UserNotFoundException
} from "@feature/security/security.exception";
import {IS_PUBLIC_KEY} from "@common/config/metadata";
import {AUTH_COOKIE_NAME, ConfigKey, configManager} from "@common/config";

@Injectable()
export class JwtGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly securityService: SecurityService,
        private reflector: Reflector
    ) {}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

        const isPublic: boolean = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass()
        ]);

        if (isPublic) {
            return true;
        }

        const requiredRoles: Role[] = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ]) || [];

        const isRefreshEndpoint: boolean = context.getHandler().name === "refresh";

        return this.validateToken(context.switchToHttp().getRequest(), requiredRoles, isRefreshEndpoint);
    }

    private validateToken(request: any, requiredRoles: Role[], isRefreshEndpoint: boolean): Observable<boolean> {

        const cookie: string = JSON.stringify(request.cookies[AUTH_COOKIE_NAME]);

        if (isRefreshEndpoint) {
            return from(Promise.resolve(true));
        }

        if (cookie) {
            try {
                const cookieParsed = JSON.parse(cookie);
                const token = cookieParsed?.token;

                if (!token || typeof token !== 'string') {
                    throw new TokenIsNotStringException();
                }

                const decoded = this.jwtService.verify(token, { secret: configManager.getValue(ConfigKey.JWT_TOKEN_SECRET), ignoreExpiration: isRefreshEndpoint });
                const id = decoded.sub;
                const userRoles: Role[] = decoded.roles || [];

                if (userRoles && userRoles.includes(Role.ADMIN)) {
                    return from(Promise.resolve(true));
                }

                const hasRequiredRole: boolean = requiredRoles.length === 0 || requiredRoles.some(role => userRoles.includes(role));

                if (!hasRequiredRole) {
                    throw new UserInsucfficientRoleException();
                }

                return from(this.securityService.detail(id)).pipe(
                    map((user: Credential): boolean => {
                        request.user = { idUser: id, roles: userRoles };
                        return true;
                    }),
                    catchError(() => {
                        throw new UserNotFoundException();
                    })
                );

            } catch (e) {
                if(e instanceof UserInsucfficientRoleException)
                    throw new UserInsucfficientRoleException();
                if(e instanceof TokenIsNotStringException)
                    throw new TokenIsNotStringException();
                throw new TokenExpiredException();
            }
        }
        throw new NoTokenFoundedException();
    }
}