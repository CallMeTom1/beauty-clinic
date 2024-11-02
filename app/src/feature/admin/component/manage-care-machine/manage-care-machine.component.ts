import {Component, inject, OnInit} from '@angular/core';
import {SecurityService} from "@feature-security";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {CareMachine} from "../../../security/data/model/machine/machine.business";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {FormcontrolSimpleConfig} from "@shared-ui";
import {ModalComponent} from "../../../shared/ui/modal/modal/modal.component";
import {
  FloatingLabelInputTestComponent
} from "../../../shared/ui/form/component/floating-label-input-test/floating-label-input-test.component";

@Component({
  selector: 'app-manage-care-machine',
  standalone: true,
  imports: [
    TranslateModule,
    ModalComponent,
    ReactiveFormsModule,
    FloatingLabelInputTestComponent
  ],
  templateUrl: './manage-care-machine.component.html',
  styleUrl: './manage-care-machine.component.scss'
})
export class ManageCareMachineComponent implements OnInit {
  protected securityService: SecurityService = inject(SecurityService);
  protected translateService: TranslateService = inject(TranslateService);

  public showEditModal = false;
  public showCreateModal = false;
  public showDeleteModal = false;
  protected modal_edit_title: string = 'modal.edit_care_machine_title';
  protected modal_create_title: string = 'modal.create_care_machine_title';
  public currentMachine: CareMachine | null = null;

  // Formulaire de création
  public createMachineFormGroup: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(50),
    ]),
    description: new FormControl('')
  });

  // Formulaire de mise à jour
  public updateMachineFormGroup: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(50),
    ]),
    description: new FormControl('')
  });

  // Configuration du formulaire de création
  public createMachineFormControlConfigs: FormcontrolSimpleConfig[] = [
    {
      label: this.translateService.instant('form.care_machine.name.label'),
      formControl: this.createMachineFormGroup.get('name') as FormControl,
      inputType: 'text',
      placeholder: this.translateService.instant('form.care_machine.create.name.placeholder')
    },
    {
      label: this.translateService.instant('form.care_machine.description.label'),
      formControl: this.createMachineFormGroup.get('description') as FormControl,
      inputType: 'textarea',
      placeholder: this.translateService.instant('form.care_machine.create.description.placeholder')
    }
  ];

  // Configuration du formulaire de mise à jour
  public updateMachineFormControlConfigs: FormcontrolSimpleConfig[] = [
    {
      label: this.translateService.instant('form.care_machine.name.label'),
      formControl: this.updateMachineFormGroup.get('name') as FormControl,
      inputType: 'text',
      placeholder: ''
    },
    {
      label: this.translateService.instant('form.care_machine.description.label'),
      formControl: this.updateMachineFormGroup.get('description') as FormControl,
      inputType: 'textarea',
      placeholder: ''
    }
  ];

  ngOnInit() {
    this.securityService.fetchCareMachine().subscribe();
  }

  openEditModal(machine: CareMachine): void {
    this.currentMachine = machine;
    this.updateMachineFormGroup.patchValue({
      name: machine.name,
      description: machine.description
    });
    this.showEditModal = true;
  }

  openDeleteModal(machine: CareMachine): void {
    this.currentMachine = {...machine};
    this.showDeleteModal = true;
  }

  openCreateModal(): void {
    this.createMachineFormGroup.reset({
      name: '',
      description: ''
    });
    this.showCreateModal = true;
  }

  handleClose(): void {
    this.showEditModal = false;
    this.showCreateModal = false;
    this.showDeleteModal = false;
    this.currentMachine = null;
  }

  deleteMachine(): void {
    if (this.currentMachine?.care_machine_id) {
      const payload = {
        care_machine_id: this.currentMachine.care_machine_id
      };

      this.securityService.deleteCareMachine(payload).subscribe({
        next: () => {
          this.handleClose();
          this.currentMachine = null;
        },
        error: (err) => {
          console.error('Erreur lors de la suppression de la machine', err);
        }
      });
    }
  }

  onSubmitCreateMachine(): void {
    if (this.createMachineFormGroup.valid) {
      const payload = {
        name: this.createMachineFormGroup.get('name')?.value || '',
        description: this.createMachineFormGroup.get('description')?.value || ''
      };

      this.securityService.addCareMachine(payload).subscribe({
        next: () => {
          this.handleClose();
        },
        error: (err) => {
          console.error('Erreur lors de la création de la machine', err);
        }
      });
    }
  }

  onSubmitUpdateMachine(): void {
    if (this.updateMachineFormGroup.valid && this.currentMachine) {
      const payload = {
        care_machine_id: this.currentMachine.care_machine_id,
        name: this.updateMachineFormGroup.get('name')?.value || '',
        description: this.updateMachineFormGroup.get('description')?.value || ''
      };

      this.securityService.updateCareMachine(payload).subscribe({
        next: () => {
          this.handleClose();
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour de la machine', err);
        }
      });
    }
  }
}
