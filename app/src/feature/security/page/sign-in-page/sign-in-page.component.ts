import {Component, inject, signal, WritableSignal} from "@angular/core";
import {CommonModule, NgOptimizedImage} from "@angular/common";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import { FormcontrolSimpleConfig} from "@shared-ui";
import {
  FloatingLabelInputComponent, FormError, handleFormError,
  LabelWithParamComponent,
  LabelWithParamDirective,
  LabelWithParamPipe
} from "@shared-ui";
import { AppRoutes} from "@shared-routes";
import {SecurityService} from "../../security.service";
import {SecurityFormComponent, SignInPayload} from "@feature-security";
import {SigninForm} from "../../interface";


@Component({
    selector: 'app-sign-in-page',
    standalone: true,
  imports: [
    CommonModule,
    FloatingLabelInputComponent,
    ReactiveFormsModule,
    TranslateModule,
    LabelWithParamPipe,
    LabelWithParamComponent,
    LabelWithParamDirective,
    SecurityFormComponent,
    NgOptimizedImage,
  ],
    templateUrl: './sign-in-page.component.html',
    styleUrls: ['./sign-in-page.component.scss']
})
export class SignInPageComponent {

  private readonly securityService: SecurityService = inject(SecurityService);
  protected readonly translateService: TranslateService = inject(TranslateService);

  public formError$: WritableSignal<FormError[]> = signal([]);

  public title:string='security-feature-signin-title';
  public redirect: string= 'security-feature-signin-redirect';
  protected brand: string = 'Coinify'
  protected logoSrc: string = 'assets/pictures/dark-logo.png';
  protected continueGoogle: string = 'security-feature-signin-googleBtn';
  protected noAccount: string = 'security-feature-signin-no-account'
  protected or: string = 'security-feature-signin-or'
  protected alt: string = 'brand logo';
  protected height: string = '50';
  protected width: string = '50';

  private signInPayload: SignInPayload = { mail:'', password: '' };

  public formGroup: FormGroup<SigninForm> = new FormGroup<SigninForm>({
        mail: new FormControl(this.signInPayload.mail, [Validators.required, Validators.minLength(10), Validators.maxLength(25), Validators.email]),
        password: new FormControl(this.signInPayload.password, [Validators.required, Validators.minLength(10), Validators.maxLength(25)])
  });

  public formControlConfigs: FormcontrolSimpleConfig[] = [
    {
      label: this.translateService.instant('security-feature-form-email-label'),
      formControl: this.formGroup.get('mail') as FormControl,
      inputType: 'mail',
      placeholder: this.translateService.instant('security-feature-form-email-placeholder')
    },
    {
      label: this.translateService.instant('security-feature-form-password-label'),
      formControl: this.formGroup.get('password') as FormControl,
      inputType: 'password',
      placeholder: this.translateService.instant('security-feature-form-password-placeholder')
    }
  ];

  constructor() {
      handleFormError(this.formGroup, this.formError$);
  }

  public error(): FormError[] {
      return this.formError$();
  }

  onSubmit(): void {
      if (this.formGroup.valid) {
          const { mail, password } = this.formGroup.value;

          const signInPayload: SignInPayload = {
              mail: mail || '',
              password: password || ''
          };
          this.securityService.SignIn(signInPayload).subscribe()

      }
  }

  handleRedirect(): void {
      this.securityService.navigate(AppRoutes.SIGNUP);
  }

  googleSign(): void{
      this.securityService.initiateGoogleLogin();
  }

}
