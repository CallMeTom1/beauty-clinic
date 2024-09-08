import {effect, inject, Injectable, signal, WritableSignal} from "@angular/core";
import {ApiResponse, ApiService, ApiURI} from "@shared-api";
import {Router} from "@angular/router";
import {UserUtils} from "./utils";
import {environment} from "@env";
import {catchError, Observable, Subscription, tap, throwError} from "rxjs";
import {AppNode, AppRoutes} from "@shared-routes";
import {User} from "./data/model/user";
import {SignInPayload, SignupPayload} from "./data";
import {Care} from "../care/data/model/care.business";
import {CareUtils} from "./utils/care.utils";
import {AddCarePayload} from "./data/payload/care/add-care.payload";
import {EditCarePayload} from "../admin/data/edit-care.payload";
import {DeleteCarePayload} from "./data/payload/care/delete-care.payload";
import {BusinessHoursUtils} from "./utils/business-hours.utils";
import {BusinessHours} from "../business-hours/data/model/business-hours.business";
import {DayOfWeekEnum} from "../business-hours/day-of-week.enum";
import {UpdateBusinessHoursPayload} from "./data/payload/businessHours/edit-business-hours.payload";
import {Holiday} from "../holiday/data/model/holiday.business";
import {HolidayUtils} from "./utils/holiday.utils";
import {CreateHolidayPayload} from "./data/payload/holiday/create-holiday.payload";
import {DeleteHolidayPayload} from "./data/payload/holiday/delete-holiday.payload";
import {CreateHolidayIntervalPayload} from "./data/payload/holiday/create-holiday-interval.payload";
import {Appointment} from "../appointment/data/model/appointment.business";
import {AppointmentUtils} from "./utils/appointment.utils";
import {CreateAppointmentPayload} from "./data/payload/appointment/create-appointment.payload";
import {
  CreateAppointmentAdminUserDoesNotExist
} from "./data/payload/appointment/create-appointment-admin-user-does-not-exist.payload";
import {UpdateAppointmentStatusPayload} from "./data/payload/appointment/update-appointment-status.payload";
import {GetAvailableDaysPayload} from "./data/payload/appointment/get-available-days.payload";
import {GetAvailableTimeSlotsPayload} from "./data/payload/appointment/get-available-time-slots.payload";
import {response} from "express";


//todo réaliser tout les fetch dans ce service pour économiser les call api
//todo séparer le service avec un autre service admin
//todo rajouter les fromdto et to dto dans les méthodes qui recoivent ou font les calls api
@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  private api: ApiService = inject(ApiService);
  private router: Router = inject(Router);

  public account$: WritableSignal<User> = signal(UserUtils.getEmpty());
  public isAuth$: WritableSignal<boolean> = signal(this.getInitialAuthState());
  public cares$: WritableSignal<Care[]> = signal(CareUtils.getEmpties());
  public businessHours$: WritableSignal<BusinessHours[]> = signal(BusinessHoursUtils.getEmpties());
  public holidays$: WritableSignal<Holiday[]> = signal(HolidayUtils.getEmpties());
  public appointment$: WritableSignal<Appointment[]> = signal(AppointmentUtils.getEmpties());
  public availableDays$: WritableSignal<Date[]> = signal([]);
  public availableSlots$: WritableSignal<string[]> = signal([]);

  private getInitialAuthState(): boolean {
    const storedAuthState: string | null = localStorage.getItem(environment.LOCAL_STORAGE_AUTH);
    return storedAuthState ? JSON.parse(storedAuthState) : false;
  }

  public setAuthState(isAuth: boolean): void {
    this.isAuth$.set(isAuth);
    localStorage.setItem(environment.LOCAL_STORAGE_AUTH, JSON.stringify(isAuth));
  }

  private setupAuthChangeEffect(): void {
    effect((): void => {
      const isAuth: boolean = this.isAuth$();
      if (isAuth) {
        this.fetchProfile(isAuth);
      }
      localStorage.setItem(environment.LOCAL_STORAGE_AUTH, JSON.stringify(isAuth));
    });
  };

  public fetchAppointments(): Observable<ApiResponse> {
    return this.api.get(ApiURI.APPOINTMENT).pipe(
      tap((response: ApiResponse): void => {
        console.log('API response received:', response);
        if(response.result){
          this.appointment$.set(response.data)

        }
      }),
      catchError(error => {
        console.error('Error during API call:', error);
        return throwError(error);
      })
    )
  };

  public createAppointment(payload: CreateAppointmentPayload): Observable<ApiResponse> {
    return this.api.post(ApiURI.APPOINTMENT, payload).pipe(
      tap((response: ApiResponse): void => {
        if(response.result){
          console.log('rendez vous créé')
        }
      }),
      catchError(error => {
        console.error('Error during API call:', error);
        return throwError(error);
      })
    )
  };

  public createAppointmentAdmin(payload: CreateAppointmentAdminUserDoesNotExist): Observable<ApiResponse> {
    return this.api.post(ApiURI.APPOINTMENT_CREATE_ADMIN, payload).pipe(
      tap((response: ApiResponse): void =>{
        if(response.result){
          console.log('rendez vous créé')
        }
      }),
      catchError(error => {
        console.error('Error during API call:', error);
        return throwError(error);
      })
    )
  };

  public updateAppointmentNote(payload: UpdateAppointmentStatusPayload): Observable<ApiResponse> {
    return this.api.put(ApiURI.APPOINTMENT_UPDATE_NOTE, payload).pipe(
      tap((response: ApiResponse): void => {
        if(response.result){
          console.log('note du rendez vous mise à jour')
        }
      }),
      catchError(error => {
        console.error('Error during API call:', error);
        return throwError(error);
      })
    )
  };

  public confirmAppointment(payload: UpdateAppointmentStatusPayload): Observable<ApiResponse> {
    return this.api.put(ApiURI.APPOINTMENT_CONFIRM, payload).pipe(
      tap((response: ApiResponse): void =>{
        if(response.result){
          console.log('rendez vous confirmé')
        }
      }),
      catchError(error => {
        console.error('Error during API call:', error);
        return throwError(error);
      })
    )
  };

  public cancelAppointment(payload: UpdateAppointmentStatusPayload): Observable<ApiResponse> {
    return this.api.put(ApiURI.APPOINTMENT_CANCEL, payload).pipe(
      tap((response: ApiResponse): void =>{
        if(response.result){
          console.log('rendez vous annulé')
        }
      }),
      catchError(error => {
        console.error('Error during API call:', error);
        return throwError(error);
      })
    )
  };

  public getAvailableDays(payload: GetAvailableDaysPayload): Observable<ApiResponse> {
    return this.api.post(ApiURI.APPOINTMENT_AVAILABLE_DAYS, payload).pipe(
      tap((response: ApiResponse): void => {
        if(response.result) {
          this.availableDays$.set(response.data);
        }
      }),
      catchError(error => {
        console.error('Error during API call:', error);
        return throwError(error);
      })
    )
  };


  public getAvailableSlots(payload: GetAvailableTimeSlotsPayload): Observable<ApiResponse> {
      return this.api.post(ApiURI.APPOINTMENT_AVAILABLE_SLOTS, payload).pipe(
        tap((response: ApiResponse): void => {
          if(response.result) {
            this.availableSlots$.set(response.data);
          }
        }),
        catchError(error => {
          console.error('Error during API call:', error);
          return throwError(error);
        })
      )
  };


  public fetchHolidays(): Observable<ApiResponse> {
    return this.api.get(ApiURI.HOLIDAY).pipe(
      tap((response: ApiResponse): void => {
        if(response.result){
          this.holidays$.set(response.data)
        }
      }),
      catchError(error => {
        console.error('Error during API call:', error);
        return throwError(error);
      })
    )
  }

  public createHoliday(payload: CreateHolidayPayload): Observable<ApiResponse> {
    return this.api.post(ApiURI.HOLIDAY, payload).pipe(
      tap((response: ApiResponse): void => {
        if(response.result) {
          console.log('Holiday successfully created', response);
        }
      }),
      catchError(error => {
        console.error('Error during creating holiday:', error);
        return throwError(error);
      })
    )
  }

  public deleteHoliday(payload: DeleteHolidayPayload): Observable<ApiResponse> {
    return this.api.delete(`${ApiURI.HOLIDAY}/${payload.holiday_date}`, payload).pipe(
      tap((response: ApiResponse): void => {
        if (response.result) {
          console.log('Holiday successfully deleted', response);
        } else {
          console.warn('Holiday deletion failed', response);
        }
      }),
      catchError(error => {
        console.error('Error during holiday deletion:', error);
        return throwError(error);
      })
    );
  }



  public createHolidayInterval(payload: CreateHolidayIntervalPayload): Observable<ApiResponse> {
    return this.api.post(ApiURI.HOLIDAY_INTERVAL, payload).pipe(
      tap((response: ApiResponse): void => {
        if(response.result){
          console.log('Holiday interval successfully added', response)
        }
      }),
      catchError(error => {
        console.error('Error during deleting holiday:', error);
        return throwError(error);
      })
    )
  }

  public fetchBusinessHours(): Observable<ApiResponse> {
    return this.api.get(ApiURI.BUSINESS_HOURS).pipe(
      tap((response: ApiResponse): void => {
        if (response.result) {
          const sortedBusinessHours = response.data.sort((a: BusinessHours, b: BusinessHours) => {
            const dayAIndex = this.daysOfWeekOrder.indexOf(a.day_of_week);
            const dayBIndex = this.daysOfWeekOrder.indexOf(b.day_of_week);
            return dayAIndex - dayBIndex;
          });
          this.businessHours$.set(sortedBusinessHours);
        } else {
          console.warn('API call did not return a successful result:', response);
        }
      }),
      catchError(error => {
        console.error('Error during API call:', error);
        return throwError(error);
      })
    );
  }


  public updateBusinessHoursByDay(dayOfWeek: DayOfWeekEnum, payload: UpdateBusinessHoursPayload): Observable<ApiResponse> {
    return this.api.put(`${ApiURI.BUSINESS_HOURS}/${dayOfWeek}`, payload).pipe(
      tap((response: ApiResponse): void => {
        if (response.result) {
          console.log('Business hours successfully updated', response);
        } else {
          console.warn('Update failed', response);
        }
      }),
      catchError(error => {
        console.error('Error during updating business hours:', error);
        return throwError(error);
      })
    );
  }

  public closeBusinessDay(dayOfWeek: DayOfWeekEnum): Observable<ApiResponse> {
    return this.api.put(`${ApiURI.BUSINESS_HOURS}/close/${dayOfWeek}`, {}).pipe(
      tap((response: ApiResponse): void => {
        if (response.result) {
          console.log('Business day successfully closed', response);
        } else {
          console.warn('Failed to close the business day', response);
        }
      }),
      catchError(error => {
        console.error('Error during closing business day:', error);
        return throwError(error);
      })
    );
  }

  public openBusinessDay(dayOfWeek: DayOfWeekEnum): Observable<ApiResponse> {
    return this.api.put(`${ApiURI.BUSINESS_HOURS}/open/${dayOfWeek}`, {}).pipe(
      tap((response: ApiResponse): void => {
        if (response.result) {
          console.log('Business day successfully opened', response);
        } else {
          console.warn('Failed to open the business day', response);
        }
      }),
      catchError(error => {
        console.error('Error during opening business day:', error);
        return throwError(error);
      })
    );
  }

  public fetchCares(): Observable<ApiResponse> {
    console.log('fetchCares() called, making API call...');
    return this.api.get(ApiURI.CARE).pipe(
      tap((response: ApiResponse): void => {
        console.log('API response received:', response);
        if (response.result) {
          console.log('API call successful, updating cares...');
          this.cares$.set(response.data);
        } else {
          console.warn('API call did not return a successful result:', response);
        }
      }),
      catchError(error => {
        console.error('Error during API call:', error);
        return throwError(error);
      })
    );
  }


  public addCare(payload: AddCarePayload): Observable<ApiResponse> {
    console.log('Payload sent to server:', payload); // Log du payload envoyé au serveur

    return this.api.post(ApiURI.ADD_CARE, payload)
      .pipe(
        tap((response: ApiResponse): void => {
          console.log('Server response:', response); // Log de la réponse du serveur

          if (response.result) {
            console.log('Care successfully added, fetching updated cares...');
            this.fetchCares();
          } else {
            console.warn('Server response indicates failure:', response);
          }
        }),
        catchError((error) => {
          console.error('Error occurred while adding care:', error); // Log de l'erreur du serveur
          return throwError(error); // Rethrow l'erreur pour être gérée ailleurs si nécessaire
        })
      );
  }

  public editCare(payload: EditCarePayload): Observable<ApiResponse> {
    console.log('Payload sent to server for editing:', payload); // Log du payload envoyé au serveur

    return this.api.put(ApiURI.CARE, payload)
      .pipe(
        tap((response: ApiResponse): void => {
          console.log('Server response:', response); // Log de la réponse du serveur

          if (response.result) {
            console.log('Care successfully edited, fetching updated cares...');
            this.fetchCares(); // Met à jour la liste des soins après une modification réussie
          } else {
            console.warn('Server response indicates failure:', response);
          }
        }),
        catchError((error) => {
          console.error('Error occurred while editing care:', error); // Log de l'erreur du serveur
          return throwError(error); // Rethrow l'erreur pour être gérée ailleurs si nécessaire
        })
      );
  }

  public deleteCare(payload: DeleteCarePayload){
    return this.api.delete(ApiURI.CARE, payload)
      .pipe(
        tap((response: ApiResponse): void => {
          if(response.result){
            this.fetchCares();
          }
        })
      )
  }



  fetchProfile(isAuth: boolean): false | Subscription {
    if (isAuth) {
      return this.me()
        .pipe(
          tap((response: ApiResponse): void => {
            if (response.result) {
              const userData = response.data.user;
              this.account$.set(UserUtils.fromDto(userData));
              localStorage.setItem(environment.LOCAL_STORAGE_ROLE, userData.role);
            }
          }))
        .subscribe();
    }
    return false;
  }

  uploadProfileImage(payload: any): Observable<ApiResponse> {
    return this.api.post(ApiURI.UPLOAD_PROFILE_IMAGE, payload)
      .pipe(
        tap((response: ApiResponse): void => {
          if (response.result) {
            this.fetchProfile(this.isAuth$());
          }
        })
      );
  }

  SignIn(payload: SignInPayload): Observable<ApiResponse> {
    return this.api.post(ApiURI.SECURITY_SIGN_IN, payload)
      .pipe(
        tap((response: ApiResponse): void => {
          if (response.result) {
            this.setAuthState(true);
            //sinon le home router se charge avant d'avoir récupérer l'image
            this.fetchProfile(this.isAuth$());
            this.router.navigate([AppNode.REDIRECT_TO_AUTHENTICATED]).then();
          }
        })
      );
  }

  SignUp(payload: SignupPayload): Observable<ApiResponse> {
    return this.api.post(ApiURI.SECURITY_SIGN_UP, payload)
      .pipe(
        tap((response: ApiResponse): void => {
          if (response.result) {
            this.setAuthState(true)
            //sinon le home router se charge avant d'avoir récupérer l'image
            this.fetchProfile(this.isAuth$());
            this.router.navigate([AppNode.REDIRECT_TO_AUTHENTICATED]).then();
          }
        })
      );
  }

  initiateGoogleLogin(): void {
    window.location.href = ApiURI.SIGN_GOOGLE_URL;
  }

  me(): Observable<ApiResponse> {
    return this.api.get(ApiURI.ME);
  }

  logout(): void {
    this.setAuthState(false)
    this.account$.set(UserUtils.getEmpty());
    localStorage.setItem(environment.LOCAL_STORAGE_ROLE, '');
    this.navigate(AppRoutes.SIGNIN);
  }

  navigate(link: string) {
    this.router.navigate([link]).then();
  }

  private readonly daysOfWeekOrder: DayOfWeekEnum[] = [
    DayOfWeekEnum.MONDAY,
    DayOfWeekEnum.TUESDAY,
    DayOfWeekEnum.WEDNESDAY,
    DayOfWeekEnum.THURSDAY,
    DayOfWeekEnum.FRIDAY,
    DayOfWeekEnum.SATURDAY,
    DayOfWeekEnum.SUNDAY
  ];


}
