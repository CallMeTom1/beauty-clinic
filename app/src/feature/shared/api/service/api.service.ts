import {catchError, map, Observable, of} from "rxjs";
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {inject, Injectable} from "@angular/core";
import {ApiResponse} from "../api.response";
import {environment} from "@env";
import {Payload} from "@shared-core";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseURL: string = environment.apiURL;
  private readonly paramIsMissingErrorCode: number = environment.PARAM_IS_MISSING;
  private readonly http: HttpClient = inject(HttpClient);
  get(partURL: string, params?: HttpParams | { [param: string]: string | string[] }): Observable<ApiResponse> {
    return this.handle(this.http.get(`${this.baseURL}${partURL}`, { params }));
  }

  post(partURL: string, payload?: Payload): Observable<ApiResponse> {
    return this.handle(this.http.post(`${this.baseURL}${partURL}`, payload));
  }
  put(partURL: string, payload: Payload): Observable<ApiResponse> {
    return this.handle(this.http.put(`${this.baseURL}${partURL}`, payload));
  }
  delete(partURL: string, payload?: Payload): Observable<ApiResponse> {
    return this.handle(this.http.delete(`${this.baseURL}${partURL}`, payload));
  }
  patch(partURL: string, payload: Payload): Observable<ApiResponse> {
    return this.handle(this.http.patch(`${this.baseURL}${partURL}`, payload));  // Ajout de la méthode patch
  }
  private handle(obs: Observable<any>): Observable<ApiResponse> {
    return obs.pipe(
        map((response: Object) => this.successHandler(response)),
        catchError((error: HttpErrorResponse) => of(this.errorHandler(error))));
  }
  private errorHandler(httpError: HttpErrorResponse): ApiResponse {
    return {...httpError.error, paramError: (httpError.status === this.paramIsMissingErrorCode)}
  }
  private successHandler(response: Object): ApiResponse {
    return {...response as ApiResponse, paramError: false}
  }

}
