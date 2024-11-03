import {SecurityFormComponent, SecurityService, SignupPayload} from "@feature-security";
import {Component, effect, EffectRef, inject, signal, WritableSignal} from "@angular/core";
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {
  FloatingLabelInputComponent, FormcontrolSimpleConfig, FormError, handleFormError,
  LabelWithParamComponent,
  LabelWithParamDirective,
  LabelWithParamPipe
} from "@shared-ui";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {AppNode, AppRoutes} from "@shared-routes";
import {MailService} from "@feature-home";
import {SignupForm} from "../../interface";
import {GoogleButtonComponent} from "../../component/google-button/google-button.component";
import {
  FloatingLabelInputTestComponent
} from "../../../shared/ui/form/component/floating-label-input-test/floating-label-input-test.component";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-sign-up-page',
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
    FloatingLabelInputTestComponent,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './sign-up-page.component.html',
  styleUrls: ['./sign-up-page.component.scss']
})
export class SignUpPageComponent {

  protected readonly securityService: SecurityService = inject(SecurityService);
  private readonly mailService: MailService = inject(MailService);
  protected readonly translateService: TranslateService = inject(TranslateService);

  protected logoSrc: string = './assets/icon/logo-beauty-clinic.svg';
  protected alt: string = 'brand logo';
  protected height: string = '50';
  protected width: string = '50';
  protected brand: string = 'Izzy Beauty'
  protected title:string='security-feature-sign-up-page-title';
  protected redirect: string= 'security-feature-sign-up-page-redirect';
  private initialMail: string | null = this.mailService.mailHome$() || '';
  protected or: string = 'security-feature-signup-or';
  protected googleBtn: string = 'security-feature-signup-googleBtn';
  protected already: string = 'security-feature-signup-already-account';
  protected connect: string = 'security-feature-signup-connect';

  public signupSuccess: boolean = false;
  public successMessage: string = '';

  private signUpPayload: SignupPayload = {
    username: '',
    firstname: '',
    lastname: '',
    mail: '',
    password: ''
  };

  public formGroup: FormGroup<SignupForm> = new FormGroup<SignupForm>({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20)
    ]),
    firstname: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20)
    ]),
    lastname: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20)
    ]),
    mail: new FormControl(this.signUpPayload.mail || this.initialMail, [
      Validators.required,
      Validators.email,
      Validators.minLength(5),
      Validators.maxLength(25)
    ]),
    password: new FormControl(this.signUpPayload.password, [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(25)
    ])
  });

  public formControlConfigs: FormcontrolSimpleConfig[] = [
    {
      label: this.translateService.instant('security-feature.form.username.label'),
      formControl: this.formGroup.get('username') as FormControl,
      inputType: 'text',
      placeholder: this.translateService.instant('security-feature.form.username.placeholder')
    },
    {
      label: this.translateService.instant('security-feature.form.firstname.label'),
      formControl: this.formGroup.get('firstname') as FormControl,
      inputType: 'text',
      placeholder: this.translateService.instant('security-feature.form.firstname.placeholder')
    },
    {
      label: this.translateService.instant('security-feature.form.lastname.label'),
      formControl: this.formGroup.get('lastname') as FormControl,
      inputType: 'text',
      placeholder: this.translateService.instant('security-feature.form.lastname.placeholder')
    },
    {
      label: this.translateService.instant('security-feature.form.mail.label'),
      formControl: this.formGroup.get('mail') as FormControl,
      inputType: 'email',
      placeholder: this.translateService.instant('security-feature.form.mail.placeholder')
    },
    {
      label: this.translateService.instant('security-feature.form.password.label'),
      formControl: this.formGroup.get('password') as FormControl,
      inputType: 'password',
      placeholder: this.translateService.instant('security-feature.form.password.placeholder')
    }
  ];

  onSubmit(): void {
    this.securityService.error$.set(null);

    if (this.formGroup.valid) {
      const { username, firstname, lastname, password, mail } = this.formGroup.value;

      const signUpPayload: SignupPayload = {
        username: username || '',
        firstname: firstname || '',
        lastname: lastname || '',
        password: password || '',
        mail: mail || ''
      };

      this.securityService.SignUp(signUpPayload).subscribe({
        next: () => {
          if(!this.securityService.error$()){
            this.signupSuccess = true;
            this.successMessage = 'Votre compte a été créé avec succès.';

            setTimeout(() => {
              this.securityService.navigate(AppNode.HOME);
            }, 2500);
          }
        }
      });
    }
  }

  handleRedirect(): void {
    this.securityService.navigate(AppRoutes.SIGNIN);
  }

  googleSign(): void{
    this.securityService.initiateGoogleLogin();
  }

}
