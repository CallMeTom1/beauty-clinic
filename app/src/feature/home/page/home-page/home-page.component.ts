import {TranslateModule} from "@ngx-translate/core";
import {Component, inject, signal, WritableSignal} from "@angular/core";
import {
  FloatingLabelInputComponent, FormcontrolSimpleConfig, FormError, handleFormError,
  LabelWithParamComponent,
  LabelWithParamPipe
} from "@shared-ui";
import {JsonPipe, NgOptimizedImage} from "@angular/common";
import {SecurityFormComponent, SecurityService, SignupPayload} from "@feature-security";
import {MailService, SignupForm} from "@feature-home";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AppRoutes} from "@shared-routes";

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    TranslateModule,
    LabelWithParamComponent,
    LabelWithParamPipe,
    SecurityFormComponent,
    FloatingLabelInputComponent,
    JsonPipe,
    NgOptimizedImage
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {

  protected readonly securityService: SecurityService = inject(SecurityService);
  private readonly mailService: MailService = inject(MailService);

  protected title :string = 'home-feature-title';
  protected intro: string =  'home-feature-intro';
  protected intro2: string =  'home-feature-intro2';
  protected mail: string =  'home-feature-mail';
  protected mailBtn : string = 'home-feature-mail-btn';
  protected alt: string ='home-feature-alt';
  protected src: string = '/assets/pictures/homepagelogo.png';
  protected height :string = '1047';
  protected width: string = '871';

  public formError$: WritableSignal<FormError[]> = signal([]);

  private signUpPayload: SignupPayload = { username:'', password: '', mail:'', lastname:'', firstname:'', phoneNumber:'' };

  public formGroup: FormGroup<SignupForm> = new FormGroup<SignupForm>({
    mail: new FormControl(this.signUpPayload.mail, {
      validators: [Validators.required, Validators.minLength(0), Validators.maxLength(25)],
      nonNullable: true
    })
  });


  public formControlConfigs: FormcontrolSimpleConfig =
  {
    label: 'Mail',
    formControl: this.formGroup.get('mail') as FormControl,
    inputType: 'mail',
    placeholder:'Satoshi@nakamoto.com'
  }

  constructor() {
    handleFormError(this.formGroup, this.formError$);
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      const {  mail } = this.formGroup.value;

      if (mail != null) {
        this.mailService.mailHome$.set(mail);
        this.securityService.navigate(AppRoutes.SIGNUP);
      }

    }
  }

  public error(): FormError[] {
    return this.formError$();
  }

}
