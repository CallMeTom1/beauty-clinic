import {Component, effect, inject, signal, WritableSignal} from "@angular/core";
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
import {AppNode, AppRoutes} from "@shared-routes";
import {SecurityService} from "../../security.service";
import {SecurityFormComponent, SignInPayload} from "@feature-security";
import {SigninForm} from "../../interface";
import {GoogleButtonComponent} from "../../component/google-button/google-button.component";
import {RouterLink} from "@angular/router";
import {
  FloatingLabelInputTestComponent
} from "../../../shared/ui/form/component/floating-label-input-test/floating-label-input-test.component";


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
    GoogleButtonComponent,
    RouterLink,
    FloatingLabelInputTestComponent,
  ],
    templateUrl: './sign-in-page.component.html',
    styleUrls: ['./sign-in-page.component.scss']
})
export class SignInPageComponent {
  protected readonly securityService: SecurityService = inject(SecurityService);
  protected readonly translateService: TranslateService = inject(TranslateService);

  protected logoSrc: string = './assets/icon/logo-beauty-clinic.svg';
  protected alt: string = 'brand logo';
  protected height: string = '50';
  protected width: string = '50';
  protected brand: string = 'Izzy Beauty';
  protected title: string = 'Connexion à votre compte';
  protected or: string = 'security-feature-signin-or';
  protected googleBtn: string = 'security-feature-signin-googleBtn';
  protected noAccount: string = 'Vous n\'avez pas encore de compte ?';
  protected createAccount: string = 'Créer un compte';

  public signinSuccess: boolean = false;
  public successMessage: string = '';

  public formGroup: FormGroup = new FormGroup({
    mail: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.minLength(5),
      Validators.maxLength(50)
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(25)
    ]),
  });


  public formControlConfigs = [
    {
      label: this.translateService.instant('form.mail.label'),
      formControl: this.formGroup.get('mail') as FormControl,
      inputType: 'email',
      placeholder: this.translateService.instant('form.mail.placeholder')
    },
    {
      label: this.translateService.instant('form.password.label'),
      formControl: this.formGroup.get('password') as FormControl,
      inputType: 'password',
      placeholder: this.translateService.instant('form.password.placeholder')
    }
  ];

  onSubmit(): void {
    this.securityService.error$.set(null);

    if (this.formGroup.valid) {
      const { password, mail } = this.formGroup.value;

      const signinPayload: SignInPayload = {
        password: password || '',
        mail: mail || ''
      };

      this.securityService.SignIn(signinPayload).subscribe();
    }
  }

  googleSign(): void {
    this.securityService.initiateGoogleLogin();
  }
}
