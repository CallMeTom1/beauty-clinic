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
  @Input() title?: string = '';  // Titre pour le modal
  @Output() close: EventEmitter<void> = new EventEmitter<void>();  // Événement pour fermer le modal
  @Output() initiateSubmit: EventEmitter<void> = new EventEmitter<void>();  // Événement pour initier la soumission

  onClose(): void {
    this.close.emit();
  }

  onSubmit(): void {
    this.initiateSubmit.emit();  // Émet pour soumettre le formulaire
  }

}
