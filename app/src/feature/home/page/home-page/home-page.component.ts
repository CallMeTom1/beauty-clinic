import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {Component, inject, signal, WritableSignal} from "@angular/core";
import {
  FloatingLabelInputComponent,
  FormcontrolSimpleConfig, FormError, handleFormError,
  LabelWithParamComponent,
  LabelWithParamPipe
} from "@shared-ui";
import {JsonPipe, NgOptimizedImage} from "@angular/common";
import {SecurityFormComponent} from "@feature-security";
import {HomeHeaderComponent} from "../../component/home-header/home-header.component";
import {HomeIntroConfigCard} from "../../../shared/ui/home-intro-card/home-intro-config.interface";
import {HomeIntroCardComponent} from "../../../shared/ui/home-intro-card/home-intro-card.component";
import {CareTrendCardConfig} from "../../../shared/ui/care-trend-card/care-trend-card.config";
import {CareTrendCardComponent} from "../../../shared/ui/care-trend-card/care-trend-card.component";
import {FormComponent} from "../../../shared/ui/form/component/form/form.component";
import {ContactForm} from "../../data/interface/contact-form.interface";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CareCategory} from "../../../care/data/care-category.enum";
import {CareCardConfig} from "../../../shared/ui/care-card/care-card.config";
import {CareCardComponent} from "../../../shared/ui/care-card/care-card.component";

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
    NgOptimizedImage,
    HomeHeaderComponent,
    HomeIntroCardComponent,
    CareTrendCardComponent,
    FormComponent,
    CareCardComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {

  constructor() {
    handleFormError(this.formGroup, this.formError$);
  }
  protected readonly translateService:TranslateService = inject(TranslateService);

  public formError$: WritableSignal<FormError[]> = signal([]);

  protected readonly title: string = "home-feature-title";
  protected readonly intro: string = "home-feature-intro";
  protected readonly presUpTitle: string = "home-feature-presentation-up-title";
  protected readonly presTitle: string = "home-feature-presentation-title";
  protected readonly presText1: string = "home-feature-presentation-text-1";
  protected readonly presText2: string = "home-feature-presentation-text-2";
  protected readonly presText3: string = "home-feature-presentation-text-3";
  protected readonly diagTitle: string = "home-feature-diag-title";
  protected readonly diagText: string = "home-feature-diag-text";
  protected readonly diagBtnTxt: string = "home-feature-diag-btn-text";
  protected readonly careTrendTitle: string = "home-feature-care-trend-title";
  protected readonly allCareBtnText: string = "home-feature-care-all-btn-text";

  public formGroup: FormGroup<ContactForm> = new FormGroup<ContactForm>({
    firstName: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(25)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(25)]),
    email: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(25)]),
    phoneNumber: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(25)]),
    careCategory: new FormControl<CareCategory>(CareCategory.Epilation, [
      Validators.required
    ]),    message: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(25)]),
  });

  public formControlConfigs: FormcontrolSimpleConfig[] = [
    {
      label: 'contact.form.firstName',
      formControl: this.formGroup.get('firstName') as FormControl,
      inputType: 'text',
      placeholder: 'contact.form.enter_firstName'
    },
    {
      label: 'contact.form.lastName',
      formControl: this.formGroup.get('lastName') as FormControl,
      inputType: 'text',
      placeholder: 'contact.form.enter_lastName'
    },
    {
      label: 'contact.form.email',
      formControl: this.formGroup.get('email') as FormControl,
      inputType: 'email',
      placeholder: 'contact.form.enter_email'
    },
    {
      label: 'contact.form.phoneNumber',
      formControl: this.formGroup.get('phoneNumber') as FormControl,
      inputType: 'tel',
      placeholder: 'contact.form.enter_phoneNumber'
    },
    {
      label: 'contact.form.careCategory',
      formControl: this.formGroup.get('careCategory') as FormControl,
      inputType: 'select',
      options: Object.values(CareCategory).map(category => ({
        value: category,
        label: this.getTranslatedCategory(category) // Utilisation de la traduction pour chaque option
      })),
      placeholder: 'contact.form.select_careCategory'
    },
    {
      label: 'contact.form.message',
      formControl: this.formGroup.get('message') as FormControl,
      inputType: 'textarea',
      placeholder: 'contact.form.enter_message'
    }
  ].map(item => ({
    ...item,
    label: this.translateService.instant(item.label),
    placeholder: this.translateService.instant(item.placeholder),
    options: item.options ? item.options.map(option => ({
      value: option.value,
      label: this.translateService.instant(option.label)
    })) : []
  }));

  // Fonction pour traduire les catégories de soins
  private getTranslatedCategory(category: CareCategory): string {
    return this.translateService.instant(`care.category.${category.toLowerCase()}`);
  }

  introCardsConfig: HomeIntroConfigCard[] = [
    {
      src: './assets/pictures/woman-looking-miror.png',
      title: 'home-intro-card.title1',
      description: 'home-intro-card.description1',
      btnTxt: 'home-intro-card.btnTxt1'
    },
    {
      src: './assets/pictures/women-care.png',
      title: 'home-intro-card.title2',
      description: 'home-intro-card.description2',
      btnTxt: 'home-intro-card.btnTxt2'
    },
    {
      src: './assets/pictures/women-talk.png',
      title: 'home-intro-card.title3',
      description: 'home-intro-card.description3',
      btnTxt: 'home-intro-card.btnTxt3'
    }
  ];

  careCardConfig: CareCardConfig[] = [
    {
    src: './assets/pictures/diagnostique.png',
    title: 'home-care-card.title1',
    btnTxt: 'home-care-card.btnTxt1'
    },
    {
      src: './assets/pictures/epilation-laser.png',
      title: 'home-care-card.title2',
      btnTxt: 'home-care-card.btnTxt1'
    },
    {
      src: './assets/pictures/relachement-cutane.png',
      title: 'home-care-card.title3',
      btnTxt: 'home-care-card.btnTxt1'
    },
    {
      src: './assets/pictures/anti-cellulite.png',
      title: 'home-care-card.title4',
      btnTxt: 'home-care-card.btnTxt1'
    },
    {
      src: './assets/pictures/radio-frequence.png',
      title: 'home-care-card.title5',
      btnTxt: 'home-care-card.btnTxt1'
    },
    {
      src: './assets/pictures/peeling.png',
      title: 'home-care-card.title6',
      btnTxt: 'home-care-card.btnTxt1'
    },
    {
      src: './assets/pictures/anti-age.png',
      title: 'home-care-card.title7',
      btnTxt: 'home-care-card.btnTxt1'
    },
  ]


  public error(): FormError[] {
    return this.formError$();
  }

  onSubmit(){
    console.log("hehe");
  }
}