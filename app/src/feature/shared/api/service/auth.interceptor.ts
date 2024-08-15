import {inject, Injectable} from "@angular/core";
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from "@angular/common/http";
import {Router} from "@angular/router";
import {catchError, EMPTY, Observable, switchMap} from "rxjs";
import {environment} from "@env";
import {AppNode} from "@shared-routes";
import { SecurityService } from "feature/security/security.service";
import {ApiURI} from "../enum";
import {ApiService} from "./api.service";
import {ApiResponse} from "../api.response";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private router: Router = inject(Router);
  private api: ApiService = inject(ApiService);
  private securityService: SecurityService = inject(SecurityService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const publicRoutes: string [] = [
      `${environment.apiURL}account/signin`,
      `${environment.apiURL}account/signup`,
      `${environment.apiURL}account/refresh`,
      `${environment.apiURL}topics`
    ];

    const isPublicRoute = (url: string) => publicRoutes.includes(url) || !url.startsWith(environment.apiURL);

    req = req.clone({ withCredentials: true });

    if (isPublicRoute(req.url)) {
      return next.handle(req);
    }

    return next.handle(req).pipe(
        catchError((err: HttpErrorResponse) => this.handleError(err, req, next, this.router, this.api))

    );
  }

  private handleError = (error: HttpErrorResponse, req: HttpRequest<any>, next: HttpHandler, router: Router, api: ApiService) => {
    if (error.status === 401 || error.status === 403) {
      req = req.clone({ withCredentials: true });
      return api.get(ApiURI.REFRESH_TOKEN).pipe(
          switchMap((response: ApiResponse) => {
            if (response.result) {
              this.securityService.setAuthState(true);
              return next.handle(req);
            }
            this.securityService.setAuthState(false);
            return this.redirectToPublic(router);
          }),
          catchError(() => {
            this.securityService.setAuthState(false);
            return this.redirectToPublic(router);
          })
      );
    }
    return this.handleCommonError(error);
  };

  private handleCommonError = (err: HttpErrorResponse): Observable<any> => {
    throw (err);
  }

  private redirectToPublic: (router: Router) => Observable<any> = (router: Router) => {
    router.navigate([AppNode.REDIRECT_TO_PUBLIC]).then();
    return EMPTY;
  };
}
