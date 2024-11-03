import {effect, inject, Injectable, signal, WritableSignal} from "@angular/core";
import {ApiResponse, ApiService, ApiURI} from "@shared-api";
import {Router} from "@angular/router";
import {UserUtils} from "./utils";
import {environment} from "@env";
import {catchError, map, Observable, Subscription, tap, throwError} from "rxjs";
import {AppNode, AppRoutes} from "@shared-routes";
import {User} from "./data/model/user";
import {SignInPayload, SignupPayload} from "./data";
import {Care} from "./data/model/care/care.business";
import {CareUtils} from "./utils/care.utils";
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
import {Customer} from "../customer/data/model/customer.business";
import {ResetPasswordPayload} from "./data/payload/user/reset-password.payload";
import {ForgotPasswordPayload} from "./data/payload/user/forgot-password.payload";
import {ModifyProfilePayload} from "./data/payload/user/modify-profile.payload";
import {ModifyPasswordPayload} from "./data/payload/user/modify-password.payload";
import {CategoryProduct} from "./data/model/category-product/category-product.business";
import {ProductCategoryUtils} from "./utils/product-category.utils";
import {Product} from "./data/model/product/product.business";
import {ProductUtils} from "./utils/product.utils";
import {UpdateCategoryProductPayload} from "./data/payload/category-product/update-category-product.payload";
import {CreateCategoryProductPayload} from "./data/payload/category-product/create-category-product.payload";
import {RemoveCategoryProductPayload} from "./data/payload/category-product/remove-category-product.payload";
import {UpdateProductPayload} from "./data/payload/product/update-product.payload";
import {RemoveProductPayload} from "./data/payload/product/remove-product.payload";
import {UpdateProductStatusPayload} from "./data/payload/product/update-product-status.payload";
import {UpdateProductCategoryPayload} from "./data/payload/product/update-product-category.payload";
import {Cart} from "./data/model/cart/cart.business";
import {CartUtils} from "./utils/cart.utils";
import {AddCartItemPayload} from "./data/payload/cart/add-cart-item.payload";
import {RemoveCartItemPayload} from "./data/payload/cart/remove-cart-item.payload";
import {UpdateCartItemPayload} from "./data/payload/cart/update-cart-item.payload";
import {OrderUtils} from "./utils/order.utils";
import {Order} from "./data/model/order/order.business";
import {UpdateShippingAddressPayload} from "./data/payload/order/update-shipping-address.payload";
import {CreateProductPayload} from "./data/payload/product/create-product.payload";
import {PromotionalCode} from "./data/model/promotional-code/promotional-code.business";
import {ShippingFee} from "./data/model/shipping-fee/shipping-fee.business";
import {PromoCodeUtils} from "./utils/promo-code.utils";
import {ShippingFeeUtils} from "./utils/shipping-fee.utils";
import {CreatePromoCodePayload} from "./data/payload/promo-code/create-promo-code.payload";
import {UpdatePromoCodePayload} from "./data/payload/promo-code/update-promo-code.payload";
import {DeletePromoCodePayload} from "./data/payload/promo-code/delete-promo-code.payload";
import {UpdateShippingFeePayload} from "./data/payload/shipping-fee/update-shipping-fee.payload";
import {CareCategory} from "./data/model/care-category/care-category.business";
import {CareCategoryUtils} from "./utils/care-category.utils";
import {DeleteCareCategoryPayload} from "./data/payload/care-category/delete-care-category.payload";
import {CreateCareCategoryPayload} from "./data/payload/care-category/create-care-category.payload";
import {UpdateCareCategoryPayload} from "./data/payload/care-category/update-care-category.payload";
import {CareSubCategory} from "./data/model/care-sub-category/care-sub-category.business";
import {CareSubCategoryUtils} from "./utils/care-sub-category.utils";
import {CreateCareSubCategoryPayload} from "./data/payload/care-sub-category/create-care-sub-category.payload";
import {UpdateCareSubCategoryPayload} from "./data/payload/care-sub-category/update-care-sub-category.payload";
import {DeleteCareSubCategoryPayload} from "./data/payload/care-sub-category/delete-care-sub-category.payload";
import {BodyZoneUtils} from "./utils/body-zone.utils";
import {BodyZone} from "./data/model/body-zone/body-zone.business";
import {CreateBodyZonePayload} from "./data/payload/body-zone/create-body-zone.payload";
import {UpdateBodyZonePayload} from "./data/payload/body-zone/update-body-zone.payload";
import {DeleteBodyZonePayload} from "./data/payload/body-zone/delete-body-zone.payload";
import {ApplyPromoCodePayload} from "./data/payload/cart/apply-promo-code-cart.payload";
import {Wishlist} from "./data/model/wishlist/wishlist.business";
import {WishlistUtils} from "./utils/wishlist.utils";
import {CreateReviewPayload} from "./data/payload/review/create-review.payload";
import {UpdateReviewPayload} from "./data/payload/review/update-review.payload";
import {DeleteReviewPayload} from "./data/payload/review/delete-review.payload";
import {AddToWishlistPayload} from "./data/payload/wishlist/add-to-wishlist.payload";
import {RemoveFromWishlistPayload} from "./data/payload/wishlist/remowe-from-wishlist.payload";
import {ClinicUtils} from "./utils/clinic.utils";
import {Clinic} from "./data/model/clinic/clinic.business";
import {UpdateClinicPayload} from "./data/payload/clinic/update-clinic.payload";
import {response} from "express";
import {CareMachineUtils} from "./utils/care-machine.utils";
import {CareMachine} from "./data/model/machine/machine.business";
import {UpdateCareMachinePayload} from "./data/payload/care-machine/update-care-machine.payload";
import {CreateCareMachinePayload} from "./data/payload/care-machine/create-care-machine.payload";
import {DeleteCareMachinePayload} from "./data/payload/care-machine/delete-care-machine.payload";
import {CreateCarePayload} from "./data/payload/care/add-care.payload";
import {UpdateCarePayload} from "./data/payload/care/edit-care.payload";
import { UpdateCareBodyZonesPayload} from "./data/payload/care/update-care-body-zone.payload";
import {UpdateCareCategoriesPayload} from "./data/payload/care/update-care-category.payload";
import {UpdateCareMachinesPayload} from "./data/payload/care/update-care-machine.payload";
import {UpdateCareSubCategoriesPayload} from "./data/payload/care/update-care-sub-category.payload";
import {UpdateStatusOrderPayload} from "./data/payload/order/update-status-order.payload";
import {UpdateOrderTrackingNumberPayload} from "./data/payload/order/update-order-tracking-number.payload";


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
  public caresPublished$: WritableSignal<Care[]> = signal(CareUtils.getEmpties());
  public businessHours$: WritableSignal<BusinessHours[]> = signal(BusinessHoursUtils.getEmpties());
  public holidays$: WritableSignal<Holiday[]> = signal(HolidayUtils.getEmpties());
  public appointment$: WritableSignal<Appointment[]> = signal(AppointmentUtils.getEmpties());
  //todo faire des utils
  public availableDays$: WritableSignal<Date[]> = signal([]);
  public availableSlots$: WritableSignal<string[]> = signal([]);
  public customers$: WritableSignal<Customer[]> = signal([]);

  public CategoryProducts$: WritableSignal<CategoryProduct[]> = signal([])
  public CategoryProductsPublished$: WritableSignal<CategoryProduct[]> = signal([])

  public Products$: WritableSignal<Product[]> = signal([])
  public ProductsPublished$: WritableSignal<Product[]> = signal([])

  public cart$: WritableSignal<Cart> = signal(CartUtils.getEmpty())

  public error$: WritableSignal<string | null> = signal(null);
  public sucesMessage$: WritableSignal<string | null> = signal(null);

  public order$: WritableSignal<Order> = signal(OrderUtils.getEmptyOrder());

  public orders$: WritableSignal<Order[]> = signal(OrderUtils.getEmptyOrders())

  public promoCodes$: WritableSignal<PromotionalCode[]> = signal(PromoCodeUtils.getEmpties());
  public shippingFees$: WritableSignal<ShippingFee> = signal(ShippingFeeUtils.getEmpty());

  public careCategories$: WritableSignal<CareCategory[]> = signal(CareCategoryUtils.getEmpties())
  public careSubCategories$: WritableSignal<CareSubCategory[]> = signal(CareSubCategoryUtils.getEmpties())
  public bodyZones$: WritableSignal<BodyZone[]> = signal(BodyZoneUtils.getEmpties());

  public wishList$: WritableSignal<Wishlist> = signal(WishlistUtils.getEmpty())

  public clinic$: WritableSignal<Clinic> = signal(ClinicUtils.getEmpty())

  public careMachine$: WritableSignal<CareMachine[]> = signal(CareMachineUtils.getEmpties())


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

  public fetchCustomers(): Observable<ApiResponse> {
    return this.api.get(ApiURI.USER).pipe(
      tap((response: ApiResponse): void => {
        if(response.result){
          this.customers$.set(response.data)
        }
      }),
      catchError(error => {
        console.error('Error during API call:', error);
        return throwError(error);
      })
    )
  }


  //Appointment
  public fetchAppointments(): Observable<ApiResponse> {
    return this.api.get(ApiURI.APPOINTMENT).pipe(
      tap((response: ApiResponse): void => {
        if(response.result){
          // On utilise directement les objets Care et User de la réponse
          this.appointment$.set(response.data);
        }
      }),
      catchError(error => {
        console.error('Error during API call:', error);
        return throwError(error);
      })
    )
  }

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


  //Holiday and business-hours
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


  //CARE
  public fetchCares(): Observable<ApiResponse> {
    console.log('fetchCares() called, making API call...');
    return this.api.get(ApiURI.CARE).pipe(
      tap((response: ApiResponse): void => {
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

  public fetchPublicCares(): Observable<ApiResponse> {
    return this.api.get(ApiURI.CARE_PUBLISHED).pipe(
      tap((response: ApiResponse): void => {
        if (response.result) {
          console.log('API call successful, updating cares...');
          this.caresPublished$.set(response.data);
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

  public addCare(payload: CreateCarePayload): Observable<ApiResponse> {

    return this.api.post(ApiURI.CARE, payload)
      .pipe(
        tap((response: ApiResponse): void => {

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

  public editCare(payload: UpdateCarePayload): Observable<ApiResponse> {

    return this.api.put(ApiURI.CARE, payload)
      .pipe(
        tap((response: ApiResponse): void => {

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

  public uploadCareImage(payload: FormData): Observable<ApiResponse> {
    return this.api.post(ApiURI.CARE_UPLOAD_IMAGE, payload)
      .pipe(
        tap((response: ApiResponse): void => {
          if (response.result) {
            // Rafraîchir la liste des soins pour avoir l'image mise à jour
            this.fetchCares().subscribe();
          }
        }),
        catchError(error => {
          console.error('Error during care image upload:', error);
          return throwError(error);
        })
      );
  }

  updateCareCategories(payload: UpdateCareCategoriesPayload): Observable<ApiResponse> {
    return this.api.put(ApiURI.CARE, payload)
  }

  updateCareSubCategories(payload: UpdateCareSubCategoriesPayload): Observable<ApiResponse> {
    return this.api.put(ApiURI.CARE, payload)
  }

  updateCareBodyZones(payload: UpdateCareBodyZonesPayload): Observable<ApiResponse> {
    return this.api.put(ApiURI.CARE, payload)
  }

  updateCareMachines(payload: UpdateCareMachinesPayload): Observable<ApiResponse> {
    return this.api.put(ApiURI.CARE, payload)
  }

  navigate(link: string) {
    this.router.navigate([link]).then();
  }

  //ACCOUNT
  public modifyProfile(payload: ModifyProfilePayload): Observable<ApiResponse> {
    return this.api.put(ApiURI.USER, payload).pipe(
      tap((response: ApiResponse): void => {
        this.me().subscribe()
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



  SignIn(payload: SignInPayload): Observable<ApiResponse> {
    return this.api.post(ApiURI.SECURITY_SIGN_IN, payload)
      .pipe(
        tap((response: ApiResponse): void => {
          console.log(payload);
          if (response.code === 'api.security.user.user_not_found')
          {
            this.error$.set('error.wrong_password_or_mail');
          }
          else if (response.result)
          {
            this.setAuthState(true);
            //sinon le home router se charge avant d'avoir récupérer l'image
            this.fetchProfile(this.isAuth$());
            this.error$.set(null);
            this.router.navigate([AppNode.REDIRECT_TO_AUTHENTICATED]).then();
          }
        })
      );
  }

  SignUp(payload: SignupPayload): Observable<ApiResponse> {
    return this.api.post(ApiURI.SECURITY_SIGN_UP, payload)
      .pipe(
        tap((response: ApiResponse): void => {
          this.error$.set(null);
          if (response.code === 'api.security.user.user_already_exist') {
            this.error$.set('error.email_already_used');
          } else if (response.result) {
            this.setAuthState(true);
            this.fetchProfile(this.isAuth$());
            // Réinitialiser l'erreur en cas de succès
            this.error$.set(null);
          } else {
            // Gérer d'autres types d'erreurs spécifiques si nécessaire
            this.error$.set('error.generic_error');
          }
        }),
      );
  }

  logout(): Observable<ApiResponse> {
    return this.api.get(ApiURI.SIGN_OUT)
      .pipe(
        tap((response: ApiResponse): void => {
          if (response.result) {
            this.setAuthState(false)
            this.account$.set(UserUtils.getEmpty());
            localStorage.setItem(environment.LOCAL_STORAGE_ROLE, '');
            this.navigate(AppRoutes.SIGNIN);
          }
        })
      )
  }

  verifyEmail(token: string): Observable<ApiResponse> {
    return this.api.get(ApiURI.VERIFY_EMAIL, {token})
  }

  initiateGoogleLogin(): void {
    window.location.href = ApiURI.SIGN_GOOGLE_URL;
  }

  me(): Observable<ApiResponse> {
    return this.api.get(ApiURI.ME)
      .pipe(
        tap((response: ApiResponse): void => {
          if(response.result){
            this.account$.set(response.data.user)
        }
      })
      )
  }

  resetPassword(payload: ResetPasswordPayload) {
    return this.api.post(ApiURI.RESET_PASSWORD, payload)
      .pipe(
        tap((response: ApiResponse): void => {
          if (response.result) {
            this.router.navigate([AppNode.SIGNIN]).then();
          }
        })
      );
  }

  changePassword(payload: ModifyPasswordPayload): Observable<ApiResponse> {
    return this.api.put(ApiURI.CHANGE_PASSWORD, payload)

  }

  forgotPassword(payload: ForgotPasswordPayload) {
    return this.api.post(ApiURI.FORGOT_PASSWORD, payload) // Assure-toi de bien passer le payload avec l'email
      .pipe(
        tap((response: ApiResponse): void => {
          if (response.result) {

          }
          else{
            this.router.navigate([AppNode.SIGNIN]).then();
          }
        })
      );
  }

  //CATEGORY PRODUCTS
  fetchCategoryProducts(): Observable<ApiResponse> {
    return this.api.get(ApiURI.PRODUCT_CATEGORIES)
      .pipe(
        tap((response: ApiResponse): void => {
          if (response.result && Array.isArray(response.data)) {
            console.log('response', response.data)
            this.CategoryProducts$.set(ProductCategoryUtils.fromDtos(response.data)); // Utiliser fromDtos pour les tableaux
          }
        })
      );
  }

  fetchCategoryProductsPublished(): Observable<ApiResponse>{
    return this.api.get(ApiURI.PRODUCT_CATEGORIES_PUBLISHED)
      .pipe(
        tap((response: ApiResponse): void => {
          if(response.result){
            this.CategoryProductsPublished$.set(ProductCategoryUtils.fromDtos(response.data));
          }
        })
      )
  }

  createCategoryProduct(payload: CreateCategoryProductPayload): Observable<ApiResponse>{
    return this.api.post(ApiURI.PRODUCT_CATEGORIES, payload)
  }

  updateCategoryProduct(payload: UpdateCategoryProductPayload): Observable<ApiResponse> {
    return this.api.put(ApiURI.PRODUCT_CATEGORIES, payload)
  }

  deleteCategoryProduct(payload: RemoveCategoryProductPayload): Observable<ApiResponse>{
    console.log('payload envoyé', payload)
    return this.api.delete(ApiURI.PRODUCT_CATEGORIES, payload)
  }

  //PRODUCTS
  fetchProducts(): Observable<ApiResponse> {
    return this.api.get(ApiURI.PRODUCTS) // Corriger l'URL si c'est PRODUCTS et non PRODUCT_CATEGORIES
      .pipe(
        tap((response: ApiResponse): void => {
          if (response.result && Array.isArray(response.data)) {
            this.Products$.set(ProductUtils.fromDtos(response.data)); // Utiliser fromDtos pour les tableaux
          }
        })
      );
  }

  fetchProductsPublished(): Observable<ApiResponse> {
    return this.api.get(ApiURI.PRODUCT_PUBLISHED)
      .pipe(
        tap((response: ApiResponse): void => {
          if (response.result && Array.isArray(response.data)) {
            console.log('response product published', response.data)
            this.ProductsPublished$.set(ProductUtils.fromDtos(response.data)); // Utiliser fromDtos pour les tableaux
          }
        })
      );
  }


  createProduct(payload: CreateProductPayload): Observable<ApiResponse>{
    console.log('payload envoyé create product', payload)
    return this.api.post(ApiURI.PRODUCTS, payload)
      .pipe(
        tap((response: ApiResponse): void => {
          if(response.result){
            console.log(response)
          }
    })
      )
  }

  updateProduct(payload: UpdateProductPayload): Observable<ApiResponse> {
    return this.api.put(ApiURI.PRODUCTS, payload)
  }

  deleteProduct(payload: RemoveProductPayload): Observable<ApiResponse>{
    return this.api.delete(ApiURI.PRODUCTS, payload)
  }

  publishProduct(payload: UpdateProductStatusPayload): Observable<ApiResponse> {
    return this.api.put(ApiURI.PRODUCT_PUBLISH, payload)
  }

  unpublishProduct(payload: UpdateProductStatusPayload): Observable<ApiResponse> {
    return this.api.put(ApiURI.PRODUCT_UNPUBLISH, payload)
  }

  uploadProductImage(payload: FormData): Observable<ApiResponse> {
    return this.api.post(ApiURI.PRODUCT_UPLOAD_IMAGE, payload);
  }

  // Mettre à jour les catégories d'un produit
  updateProductCategories(payload: UpdateProductCategoryPayload): Observable<ApiResponse> {
    return this.api.put(ApiURI.PRODUCTS, payload) // Adapter l'URI
      .pipe(
        tap((response: ApiResponse): void => {
          if (response.result) {
            console.log('Catégories mises à jour avec succès:', response.data);
          } else {
            console.log('Erreur lors de la mise à jour des catégories:', response.code);
          }
        })
      );
  }

  //Cart
  fetchCart(): Observable<ApiResponse> {
    return this.api.get(ApiURI.CART)
      .pipe(
        tap((response: ApiResponse): void => {
          if (response.result) {
            this.cart$.set(response.data);
          } else {
            console.log('Erreur lors du fetch cart:', response.code);
          }
        })
      );
  }

  addProductToCart(payload: AddCartItemPayload): Observable<ApiResponse> {
    return this.api.put(ApiURI.CART, payload)
      .pipe(
        tap((response: ApiResponse): void => {
          if (response.result) {
            this.cart$.set(response.data);
          } else {
            console.log('Erreur lors de l ajout d un produit au panier:', response.code);
          }
        })
      );
  }

  removeCartItem(payload: RemoveCartItemPayload): Observable<ApiResponse> {
    return this.api.delete(ApiURI.CART, payload)
      .pipe(
        tap((response: ApiResponse): void => {
          if (response.result) {
            this.cart$.set(response.data);
          } else {
            console.log('Erreur lors de removeCartItem:', response.code);
          }
        })
      );
  }

  changeQuantity(payload: UpdateCartItemPayload): Observable<ApiResponse>{
    return this.api.put(ApiURI.CART_UPDATE_QUANTITY, payload)
      .pipe(
        tap((response: ApiResponse): void => {
          if (response.result) {
            this.cart$.set(response.data);
            this.sucesMessage$.set('Panier modifier avec succès')
          } else {
            this.error$.set('Erreur lors de la modification du panier, veuillez réessayer')

            console.log('Erreur lors de changeQuantity:', response.code);
          }
        })
      );
  }

  //ORDER
  fetchOrders() {
    return this.api.get(ApiURI.ORDERS).pipe(
      tap(response => console.log('Raw API response:', response)), // Log de la réponse brute
      map((response: ApiResponse) => {
        if (response.result) {
          console.log('Orders received:', response.data); // Log des commandes reçues
          this.orders$.set(response.data);
        }
      })
    );
  }

  getLastOrder(): Observable<ApiResponse>{
    return this.api.get(ApiURI.ORDERS_LAST)
      .pipe(
        tap((response: ApiResponse) => {
          if (response.result) {
            this.order$.set(response.data)
          } else {
            console.log('Erreur', response.code);
          }
        })
      );
  }

  initiatePaymentIntent(): Observable<string> {
    return this.api.post(ApiURI.ORDERS)
      .pipe(
        map((response: ApiResponse): string => {
          if (response.result) {
            console.log('response createorder', response.data)
            return response.data.clientSecret; // Renvoyer le client_secret
          } else {
            console.log('Erreur', response.code);
            throw new Error('Erreur lors de la création de la commande');
          }
        })
      );
  }

  createOrder(paymentStatus: string, paymentIntentId: string): Observable<ApiResponse> {
    return this.api.post(ApiURI.ORDERS_CREATE, {paymentStatus, paymentIntentId}).pipe(
      tap((response: ApiResponse)=> {
        if(response.result){
          this.order$.set(response.data);
          this.fetchCart().subscribe()
          this.navigate('cart/order/my-order-summary')
          console.log(response.data)
        }
      })
    )
  }
  updateShippingAddress(payload: UpdateShippingAddressPayload): Observable<ApiResponse> {
    return this.api.put(ApiURI.ORDER_SHIPPING_ADDRESS, payload).pipe(
      tap((response: ApiResponse) => {
        if (response.result && response.data) {
          const updatedOrder = response.data as Order;

          // Mise à jour de orders$
          this.orders$.update(orders =>
            orders.map(order =>
              order.idOrder === updatedOrder.idOrder ? updatedOrder : order
            )
          );

          // Mise à jour de order$ si c'est la commande actuellement sélectionnée
          if (this.order$().idOrder === updatedOrder.idOrder) {
            this.order$.set(updatedOrder);
          }
        }
      }),
      catchError(error => {
        console.error('Erreur lors de la mise à jour de l\'adresse de livraison:', error);
        this.error$.set('Erreur lors de la mise à jour de l\'adresse de livraison');
        return throwError(() => new Error(error));
      })
    );
  }

  updateOrderStatus(payload: UpdateStatusOrderPayload) {
    return this.api.put(ApiURI.ORDERS, payload)
  }

  updateOrderTrackingNumber(payload: UpdateOrderTrackingNumberPayload) {
    return this.api.put(ApiURI.ORDER_TRACKING_NUMBER, payload)
  }

  // Méthodes pour les codes promo
  public fetchPromoCodes(): Observable<ApiResponse> {
    return this.api.get(ApiURI.PROMO_CODES).pipe(
      tap((response: ApiResponse): void => {
        if (response.result) {
          console.log(response.data)
          this.promoCodes$.set(PromoCodeUtils.fromDtos(response.data));
        }
      })
    );
  }

  public createPromoCode(payload: CreatePromoCodePayload): Observable<ApiResponse> {
    return this.api.post(ApiURI.PROMO_CODES_CREATE, payload).pipe(
      tap((response: ApiResponse): void => {
        if (response.result) {
          this.fetchPromoCodes().subscribe();
        }
      })
    );
  }

  public updatePromoCode(payload: UpdatePromoCodePayload): Observable<ApiResponse> {
    return this.api.put(ApiURI.PROMO_CODES_UPDATE, payload).pipe(
      tap((response: ApiResponse): void => {
        if (response.result) {
          this.fetchPromoCodes().subscribe();
        }
      })
    );
  }

  public deletePromoCode(payload: DeletePromoCodePayload): Observable<ApiResponse> {
    return this.api.delete(ApiURI.PROMO_CODES_DELETE, payload).pipe(
      tap((response: ApiResponse): void => {
        if (response.result) {
          this.fetchPromoCodes().subscribe();
        }
      })
    );
  }

  // Méthodes pour le panier avec code promo
  public applyPromoCodeToCart(payload: ApplyPromoCodePayload): Observable<ApiResponse> {
    return this.api.put(ApiURI.CART_APPLY_PROMO, payload).pipe(
      tap((response: ApiResponse): void => {
        if (response.result) {
          this.cart$.set(response.data);
          this.sucesMessage$.set('Code promo appliqué avec succès');
        } else {
          this.error$.set('Erreur lors de l\'application du code promo');
        }
      })
    );
  }

  public removePromoCodeFromCart(): Observable<ApiResponse> {
    return this.api.delete(ApiURI.CART_REMOVE_PROMO).pipe(
      tap((response: ApiResponse): void => {
        if (response.result) {
          this.cart$.set(response.data);
          this.sucesMessage$.set('Code promo retiré avec succès');
        }
      })
    );
  }

  // Méthodes pour les frais de livraison
  public fetchShippingFees(): Observable<ApiResponse> {
    return this.api.get(ApiURI.SHIPPING_FEES).pipe(
      tap((response: ApiResponse): void => {
        if (response.result) {
          this.shippingFees$.set(response.data);
        }
      })
    );
  }

  public updateShippingFee(payload: UpdateShippingFeePayload): Observable<ApiResponse> {
    return this.api.put(ApiURI.SHIPPING_FEES_UPDATE, payload).pipe(
      tap((response: ApiResponse): void => {
        if (response.result) {
          this.fetchShippingFees().subscribe();
        }
      })
    );
  }


  //Care categories
  // Fetch all care categories
  public fetchCareCategories(): Observable<ApiResponse> {
    return this.api.get(ApiURI.CARE_CATEGORY).pipe(
      tap((response: ApiResponse): void => {
        if (response.result) {
          this.careCategories$.set(response.data);
        }
      }),
      catchError(error => {
        console.error('Erreur lors de la récupération des catégories:', error);
        this.error$.set('Erreur lors de la récupération des catégories');
        return throwError(() => error);
      })
    );
  }

// Create a new care category
  public createCareCategory(payload: CreateCareCategoryPayload): Observable<ApiResponse> {
    return this.api.post(ApiURI.CARE_CATEGORY, payload).pipe(
      tap((response: ApiResponse): void => {
        if (response.result) {
          this.fetchCareCategories().subscribe();
          this.sucesMessage$.set('Catégorie créée avec succès');
        }
      }),
      catchError(error => {
        console.error('Erreur lors de la création de la catégorie:', error);
        this.error$.set('Erreur lors de la création de la catégorie');
        return throwError(() => error);
      })
    );
  }

// Update a care category
  public updateCareCategory(payload: UpdateCareCategoryPayload): Observable<ApiResponse> {
    return this.api.put(ApiURI.CARE_CATEGORY, payload).pipe(
      tap((response: ApiResponse): void => {
        if (response.result) {
          this.fetchCareCategories().subscribe();
          this.sucesMessage$.set('Catégorie mise à jour avec succès');
        }
      }),
      catchError(error => {
        console.error('Erreur lors de la mise à jour de la catégorie:', error);
        this.error$.set('Erreur lors de la mise à jour de la catégorie');
        return throwError(() => error);
      })
    );
  }

// Delete a care category
  public deleteCareCategory(payload: DeleteCareCategoryPayload): Observable<ApiResponse> {
    return this.api.delete(ApiURI.CARE_CATEGORY, payload).pipe(
      tap((response: ApiResponse): void => {
        if (response.result) {
          this.fetchCareCategories().subscribe();
          this.sucesMessage$.set('Catégorie supprimée avec succès');
        }
      }),
      catchError(error => {
        console.error('Erreur lors de la suppression de la catégorie:', error);
        this.error$.set('Erreur lors de la suppression de la catégorie');
        return throwError(() => error);
      })
    );
  }

  public uploadCareCategoryImage(payload: FormData): Observable<ApiResponse> {
    return this.api.post(ApiURI.CARE_CATEGORY_IMAGE, payload)
      .pipe(
        tap((response: ApiResponse): void => {
          if (response.result) {
            // Rafraîchir la liste des soins pour avoir l'image mise à jour
            this.fetchCareCategories().subscribe();
          }
        }),
        catchError(error => {
          console.error('Error during care image upload:', error);
          return throwError(error);
        })
      );
  }

  //Care Sub Categories
  // Fetch all care categories
  public fetchCareSubCategories(): Observable<ApiResponse> {
    return this.api.get(ApiURI.CARE_SUB_CATEGORY).pipe(
      tap((response: ApiResponse): void => {
        if (response.result) {
          this.careSubCategories$.set(response.data);
        }
      }),
      catchError(error => {
        console.error('Erreur lors de la récupération des Sub catégories:', error);
        this.error$.set('Erreur lors de la récupération des Sub catégories');
        return throwError(() => error);
      })
    );
  }

// Create a new care category
  public createCareSubCategory(payload: CreateCareSubCategoryPayload): Observable<ApiResponse> {
    return this.api.post(ApiURI.CARE_SUB_CATEGORY, payload).pipe(
      tap((response: ApiResponse): void => {
        if (response.result) {
          this.fetchCareSubCategories().subscribe();
          this.sucesMessage$.set('Sub Catégorie créée avec succès');
        }
      }),
      catchError(error => {
        console.error('Erreur lors de la création de la Sub catégorie:', error);
        this.error$.set('Erreur lors de la création de la Sub catégorie');
        return throwError(() => error);
      })
    );
  }

// Update a care category
  public updateCareSubCategory(payload: UpdateCareSubCategoryPayload): Observable<ApiResponse> {
    return this.api.put(ApiURI.CARE_SUB_CATEGORY, payload).pipe(
      tap((response: ApiResponse): void => {
        if (response.result) {
          this.fetchCareSubCategories().subscribe();
          this.sucesMessage$.set('Sub Catégorie mise à jour avec succès');
        }
      }),
      catchError(error => {
        console.error('Erreur lors de la mise à jour de la Sub catégorie:', error);
        this.error$.set('Erreur lors de la mise à jour de la Sub catégorie');
        return throwError(() => error);
      })
    );
  }

// Delete a care category
  public deleteCareSubCategory(payload: DeleteCareSubCategoryPayload): Observable<ApiResponse> {
    return this.api.delete(ApiURI.CARE_SUB_CATEGORY, payload).pipe(
      tap((response: ApiResponse): void => {
        if (response.result) {
          this.fetchCareSubCategories().subscribe();
          this.sucesMessage$.set('Catégorie supprimée avec succès');
        }
      }),
      catchError(error => {
        console.error('Erreur lors de la suppression de la catégorie:', error);
        this.error$.set('Erreur lors de la suppression de la catégorie');
        return throwError(() => error);
      })
    );
  }

  public uploadCareSubCategoryImage(payload: FormData): Observable<ApiResponse> {
    return this.api.post(ApiURI.CARE_SUB_CATEGORY_IMAGE, payload)
      .pipe(
        tap((response: ApiResponse): void => {
          if (response.result) {
            // Rafraîchir la liste des soins pour avoir l'image mise à jour
            this.fetchCareSubCategories().subscribe();
          }
        }),
        catchError(error => {
          console.error('Error during care image upload:', error);
          return throwError(error);
        })
      );
  }


  //Care BodyZone
  // Fetch all body zones
  public fetchBodyZones(): Observable<ApiResponse> {
    return this.api.get(ApiURI.BODY_ZONE).pipe(
      tap((response: ApiResponse): void => {
        if (response.result) {
          this.bodyZones$.set(response.data);
        }
      }),
      catchError(error => {
        console.error('Erreur lors de la récupération des zones du corps:', error);
        this.error$.set('Erreur lors de la récupération des zones du corps');
        return throwError(() => error);
      })
    );
  }

// Create a new body zone
  public createBodyZone(payload: CreateBodyZonePayload): Observable<ApiResponse> {
    return this.api.post(ApiURI.BODY_ZONE, payload).pipe(
      tap((response: ApiResponse): void => {
        if (response.result) {
          this.fetchBodyZones().subscribe();
          this.sucesMessage$.set('Zone du corps créée avec succès');
        }
      }),
      catchError(error => {
        console.error('Erreur lors de la création de la zone du corps:', error);
        this.error$.set('Erreur lors de la création de la zone du corps');
        return throwError(() => error);
      })
    );
  }

// Update a body zone
  public updateBodyZone(payload: UpdateBodyZonePayload): Observable<ApiResponse> {
    return this.api.put(ApiURI.BODY_ZONE, payload).pipe(
      tap((response: ApiResponse): void => {
        if (response.result) {
          this.fetchBodyZones().subscribe();
          this.sucesMessage$.set('Zone du corps mise à jour avec succès');
        }
      }),
      catchError(error => {
        console.error('Erreur lors de la mise à jour de la zone du corps:', error);
        this.error$.set('Erreur lors de la mise à jour de la zone du corps');
        return throwError(() => error);
      })
    );
  }

// Delete a body zone
  public deleteBodyZone(payload: DeleteBodyZonePayload): Observable<ApiResponse> {
    return this.api.delete(ApiURI.BODY_ZONE, payload).pipe(
      tap((response: ApiResponse): void => {
        if (response.result) {
          this.fetchBodyZones().subscribe();
          this.sucesMessage$.set('Zone du corps supprimée avec succès');
        }
      }),
      catchError(error => {
        console.error('Erreur lors de la suppression de la zone du corps:', error);
        this.error$.set('Erreur lors de la suppression de la zone du corps');
        return throwError(() => error);
      })
    );
  }


  //REVIEWS
  public createReview(payload: CreateReviewPayload): Observable<ApiResponse>{
    return this.api.post(ApiURI.REVIEWS, payload);
  }

  public updateReview(payload: UpdateReviewPayload): Observable<ApiResponse> {
    return this.api.put(ApiURI.REVIEWS, payload)
  }

  public deleteReview(payload: DeleteReviewPayload): Observable<ApiResponse> {
    return this.api.delete(ApiURI.REVIEWS, payload)
  }

  //WISHLIST
  public fetchWishlist(): Observable<ApiResponse>{
    return this.api.get(ApiURI.WISHLIST)
      .pipe(
        tap((response: ApiResponse) => {
          if(response.result){
            this.wishList$.set(response.data)
          }
        })
      )
  }

  public addToWishList(payload: AddToWishlistPayload): Observable<ApiResponse> {
    return this.api.put(ApiURI.WISHLIST_ADD, payload)
  }

  public removeFromWishList(payload: RemoveFromWishlistPayload): Observable<ApiResponse> {
    return this.api.put(ApiURI.WISHLIST_REMOVE, payload)
  }


  //CLINIC

  public fetchClinic(): Observable<ApiResponse> {
    return this.api.get(ApiURI.CLINIC)
      .pipe(tap((response: ApiResponse) => {
        if (response.result) {
          this.clinic$.set(response.data)
        }
      }))
  }

  public updateClinic(payload: UpdateClinicPayload): Observable<ApiResponse> {
    return this.api.put(ApiURI.CLINIC, payload)
      .pipe(tap((response: ApiResponse) => {
        if (response.result) {
          this.clinic$.set(response.data)
        }
      }))
  }

  public uploadClinicLogo(formData: FormData): Observable<ApiResponse> {
    return this.api.post(ApiURI.CLINIC_UPLOAD_LOGO, formData)
      .pipe(tap((response: ApiResponse) => {
        if (response.result) {
          // Mettre à jour l'état si nécessaire
          this.fetchClinic().subscribe();
        }
      }));
  }



  //CARE MACHINE

  public fetchCareMachine(): Observable<ApiResponse> {
    return this.api.get(ApiURI.MACHINE)
      .pipe(tap((response: ApiResponse) => {
        if (response.result) {
          this.careMachine$.set(response.data);
        }
      }));
  }

  public addCareMachine(payload: CreateCareMachinePayload): Observable<ApiResponse> {
    return this.api.post(ApiURI.MACHINE, payload)
      .pipe(tap((response: ApiResponse) => {
        if (response.result) {
          this.fetchCareMachine().subscribe();
        }
      }))
  }

  public deleteCareMachine(payload: DeleteCareMachinePayload): Observable<ApiResponse> {
    return this.api.delete(ApiURI.MACHINE, payload)
      .pipe(tap((response: ApiResponse) => {
        if (response.result) {
          this.fetchCareMachine().subscribe();
        }
      }))
  }

  public updateCareMachine(payload: UpdateCareMachinePayload): Observable<ApiResponse> {
    return this.api.put(ApiURI.MACHINE, payload)
      .pipe(tap((response: ApiResponse) => {
        if (response.result) {
          this.fetchCareMachine().subscribe();
        }
      }))
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
