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


@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  private api: ApiService = inject(ApiService);
  private router: Router = inject(Router);

  public account$: WritableSignal<User> = signal(UserUtils.getEmpty());
  public isAuth$: WritableSignal<boolean> = signal(this.getInitialAuthState());
  public cares$: WritableSignal<Care[]> = signal(CareUtils.getEmpties());

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

}