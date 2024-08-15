import {SecurityFormComponent, SecurityService, SignupPayload} from "@feature-security";
import {Component, inject, signal, WritableSignal} from "@angular/core";
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {
  FloatingLabelInputComponent, FormcontrolSimpleConfig, FormError, handleFormError,
  LabelWithParamComponent,
  LabelWithParamDirective,
  LabelWithParamPipe
} from "@shared-ui";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {AppRoutes} from "@shared-routes";
import {MailService} from "@feature-home";
import {SignupForm} from "../../interface";

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
    NgOptimizedImage
  ],
  templateUrl: './sign-up-page.component.html',
  styleUrls: ['./sign-up-page.component.scss']
})
export class SignUpPageComponent {


  private readonly securityService: SecurityService = inject(SecurityService);
  private readonly mailService: MailService = inject(MailService);
  protected readonly translateService: TranslateService = inject(TranslateService);


  protected logoSrc: string = 'assets/pictures/dark-logo.png';
  protected alt: string = 'brand logo';
  protected height: string = '50';
  protected width: string = '50';
  protected brand: string = 'Coinify'
  protected title:string='security-feature-sign-up-page-title';
  protected redirect: string= 'security-feature-sign-up-page-redirect';
  private initialMail: string | null = this.mailService.mailHome$() || '';
  private signUpPayload: SignupPayload = { username:'', password: '', mail:'', phoneNumber: '', firstname: '', lastname: '' };
  protected or: string = 'security-feature-signup-or';
  protected googleBtn: string = 'security-feature-signup-googleBtn';
  protected already: string = 'security-feature-signup-already-account';
  protected connect: string = 'security-feature-signup-connect';

  public formError$: WritableSignal<FormError[]> = signal([]);

  public formGroup: FormGroup<SignupForm> = new FormGroup<SignupForm>({
    username: new FormControl(this.signUpPayload.username, [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(25)
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
    ]),
    phoneNumber: new FormControl(this.signUpPayload.phoneNumber, [
      Validators.required,
      Validators.pattern('^[0-9]+$'),
      Validators.minLength(10),
      Validators.maxLength(15)
    ]),
    firstname: new FormControl(this.signUpPayload.firstname, [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(25)
    ]),
    lastname: new FormControl(this.signUpPayload.lastname, [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(25)
    ])
  });

  public formControlConfigs: FormcontrolSimpleConfig[] = [
    {
      label: this.translateService.instant('form.username.label'),
      formControl: this.formGroup.get('username') as FormControl,
      inputType: 'text',
      placeholder: this.translateService.instant('form.username.placeholder')
    },
    {
      label: this.translateService.instant('form.password.label'),
      formControl: this.formGroup.get('password') as FormControl,
      inputType: 'password',
      placeholder: this.translateService.instant('form.password.placeholder')
    },
    {
      label: this.translateService.instant('form.mail.label'),
      formControl: this.formGroup.get('mail') as FormControl,
      inputType: 'email',
      placeholder: this.translateService.instant('form.mail.placeholder')
    },
    {
      label: this.translateService.instant('form.phoneNumber.label'),
      formControl: this.formGroup.get('phoneNumber') as FormControl,
      inputType: 'tel',
      placeholder: this.translateService.instant('form.phoneNumber.placeholder')
    },
    {
      label: this.translateService.instant('form.firstname.label'),
      formControl: this.formGroup.get('firstname') as FormControl,
      inputType: 'text',
      placeholder: this.translateService.instant('form.firstname.placeholder')
    },
    {
      label: this.translateService.instant('form.lastname.label'),
      formControl: this.formGroup.get('lastname') as FormControl,
      inputType: 'text',
      placeholder: this.translateService.instant('form.lastname.placeholder')
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
      const { username, password, mail, firstname, phoneNumber, lastname } = this.formGroup.value;

      const signUpPayload: SignupPayload = {
        username: username || '',
        password: password || '',
        mail: mail || '',
        firstname: firstname || '',
        lastname: lastname || '',
        phoneNumber: phoneNumber || '',
      };

      this.securityService.SignUp(signUpPayload).subscribe();

    }
  }

  handleRedirect(): void {
    this.securityService.navigate(AppRoutes.SIGNIN);
  }

  googleSign(): void{
    this.securityService.initiateGoogleLogin();
  }

}
