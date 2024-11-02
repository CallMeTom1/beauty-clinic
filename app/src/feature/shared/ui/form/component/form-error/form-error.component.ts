import {Component, Input} from '@angular/core';
import {AbstractControl, ValidationErrors} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-form-error',
  standalone: true,
  imports: [
    TranslateModule,
    NgIf,
    NgForOf
  ],
  templateUrl: './form-error.component.html',
  styleUrl: './form-error.component.scss'
})
export class FormErrorComponent {
  @Input() control!: AbstractControl;

  getErrorKeys(): { key: string, params?: any }[] {
    if (!this.control || !this.control.errors) {
      return [];
    }

    return Object.keys(this.control.errors).map(key => {
      const error = this.control.errors![key];
      let params: any = {};

      // Gestion des erreurs spécifiques avec paramètres
      if (key === 'minlength') {
        params = { length: error.requiredLength };
      } else if (key === 'maxlength') {
        params = { maxlength: error.requiredLength };
      }

      // Gestion de la correspondance des mots de passe avec accès via les crochets
      if (key === 'mustMatch') {
        key = 'passwordMismatch';  // Utilisation de la clé de traduction personnalisée
      }

      return { key, params };
    });
  }



}
