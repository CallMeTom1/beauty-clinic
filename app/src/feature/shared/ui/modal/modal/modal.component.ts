import {Component, EventEmitter, Input, Output, TemplateRef} from '@angular/core';
import {NgTemplateOutlet} from "@angular/common";
import {FloatingLabelInputComponent, FormcontrolSimpleConfig} from "@shared-ui";
import {FormGroup} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    FloatingLabelInputComponent,
    TranslateModule
  ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  @Input() title: string = 'Connexion requise';
  @Input() message: string = 'Pour ajouter des articles à votre liste de souhaits, veuillez vous connecter ou créer un compte.';
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  @Output() initiateSubmit: EventEmitter<void> = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }

  onSubmit(): void {
    this.initiateSubmit.emit();
  }

}
