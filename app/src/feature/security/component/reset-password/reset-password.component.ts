import { Component, inject } from '@angular/core';
import { SecurityService } from "@feature-security";
import { FloatingLabelInputComponent, FormcontrolSimpleConfig } from "@shared-ui";
import {
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  ReactiveFormsModule
} from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ResetPasswordPayload } from "../../data/payload/user/reset-password.payload";
import { FloatingLabelInputTestComponent } from "../../../shared/ui/form/component/floating-label-input-test/floating-label-input-test.component";

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    FloatingLabelInputComponent,
    FloatingLabelInputTestComponent,
    ReactiveFormsModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'] // Correction ici
})
export class ResetPasswordComponent {

  protected securityService: SecurityService = inject(SecurityService);
  protected readonly translateService: TranslateService = inject(TranslateService);
  protected route: ActivatedRoute = inject(ActivatedRoute);
  protected router: Router = inject(Router);

  // Variables pour le logo et la marque
  protected logoSrc: string = './assets/icon/logo-beauty-clinic.svg';
  protected alt: string = 'Logo de la marque';
  protected brand: string = 'Izzy Beauty';

  // Variables pour stocker l'état des messages
  public successMessage: string = '';
  public errorMessage: string = '';

  // Validateur personnalisé pour vérifier si les mots de passe correspondent
  passwordsMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  };

  public formGroup: FormGroup = new FormGroup({
    newPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(25)
    ]),
    confirmPassword: new FormControl('', [
      Validators.required
    ])
  }, { validators: this.passwordsMatchValidator });

  formControlConfigs: FormcontrolSimpleConfig[] = [
    {
      label: 'Nouveau mot de passe',
      formControl: this.formGroup.get('newPassword') as FormControl,
      inputType: 'password',
      placeholder: 'Entrez votre nouveau mot de passe'
    },
    {
      label: 'Confirmer le mot de passe',
      formControl: this.formGroup.get('confirmPassword') as FormControl,
      inputType: 'password',
      placeholder: 'Confirmez votre nouveau mot de passe'
    }
  ];

  private token: string | null;

  constructor() {
    // Récupérer le token depuis les paramètres de l'URL
    this.token = this.route.snapshot.queryParams['token'];
  }

  /**
   * Fonction de soumission du formulaire
   */
  onSubmit(): void {
    if (this.formGroup.valid && this.token) {
      const newPassword = this.formGroup.get('newPassword')?.value;

      const payload: ResetPasswordPayload = {
        token: this.token,
        newPassword
      };

      // Appel du service pour réinitialiser le mot de passe
      this.securityService.resetPassword(payload).subscribe({
        next: (response) => {
          // En cas de succès, afficher un message de succès et rediriger après un court délai
          this.successMessage = 'Votre mot de passe a été réinitialisé avec succès. Vous allez être redirigé vers la page de connexion.';
          setTimeout(() => {
            this.router.navigate(['/account/signin']);
          }, 3000);
        },
        error: (err) => {
          // Gestion des erreurs, afficher un message d'erreur
          console.error('Erreur lors de la réinitialisation du mot de passe', err);
          this.errorMessage = 'Une erreur est survenue lors de la réinitialisation de votre mot de passe. Veuillez réessayer plus tard.';
        }
      });
    } else {
      // Afficher un message d'erreur si le formulaire est invalide
      this.errorMessage = 'Veuillez corriger les erreurs dans le formulaire.';
    }
  }

}
