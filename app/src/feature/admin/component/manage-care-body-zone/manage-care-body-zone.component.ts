import {Component, inject, OnInit} from '@angular/core';
import {SecurityService} from "@feature-security";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {FormcontrolSimpleConfig, LabelWithParamComponent, LabelWithParamPipe} from "@shared-ui";
import {FloatingLabelInputTestComponent} from "../../../shared/ui/form/component/floating-label-input-test/floating-label-input-test.component";
import {ModalComponent} from "../../../shared/ui/modal/modal/modal.component";
import {NgClass} from "@angular/common";
import {BodyZone} from "../../../security/data/model/body-zone/body-zone.business";

@Component({
  selector: 'app-manage-care-body-zone',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FloatingLabelInputTestComponent,
    TranslateModule,
    LabelWithParamComponent,
    LabelWithParamPipe,
    ModalComponent,
    NgClass
  ],
  templateUrl: './manage-care-body-zone.component.html',
  styleUrls: ['./manage-care-body-zone.component.scss']
})
export class ManageCareBodyZoneComponent implements OnInit {
  protected securityService: SecurityService = inject(SecurityService);
  protected translateService: TranslateService = inject(TranslateService);

  public showEditModal = false;
  public showCreateModal = false;
  protected modal_edit_title: string = 'modal.edit_body_zone_title';
  protected modal_create_title: string = 'modal.create_body_zone_title';
  public showDeleteModal = false;
  public currentBodyZone: BodyZone | null = null;

  public createBodyZoneFormGroup: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(50)
    ])
  });

  public updateBodyZoneFormGroup: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(50)
    ])
  });

  public createBodyZoneFormControlConfigs: FormcontrolSimpleConfig[] = [
    {
      label: this.translateService.instant('form.body_zone.name.label'),
      formControl: this.createBodyZoneFormGroup.get('name') as FormControl,
      inputType: 'text',
      placeholder: this.translateService.instant('form.body_zone.create.name.placeholder')
    }
  ];

  public updateBodyZoneFormControlConfigs: FormcontrolSimpleConfig[] = [
    {
      label: this.translateService.instant('form.body_zone.name.label'),
      formControl: this.updateBodyZoneFormGroup.get('name') as FormControl,
      inputType: 'text',
      placeholder: ''
    }
  ];

  ngOnInit() {
    this.securityService.fetchBodyZones().subscribe();
  }

  openEditModal(bodyZone: BodyZone): void {
    this.currentBodyZone = bodyZone;
    this.updateBodyZoneFormGroup.patchValue({
      name: bodyZone.name
    });
    this.showEditModal = true;
  }

  openDeleteModal(bodyZone: BodyZone): void {
    this.currentBodyZone = {...bodyZone};
    this.showDeleteModal = true;
  }

  openCreateModal(): void {
    this.createBodyZoneFormGroup.reset({
      name: ''
    });
    this.showCreateModal = true;
  }

  handleClose(): void {
    this.showEditModal = false;
    this.showCreateModal = false;
    this.showDeleteModal = false;
    this.currentBodyZone = null;
  }

  deleteBodyZone(): void {
    if (this.currentBodyZone?.body_zone_id) {
      const payload = {
        body_zone_id: this.currentBodyZone.body_zone_id
      };

      this.securityService.deleteBodyZone(payload).subscribe({
        next: () => {
          this.handleClose();
          this.securityService.fetchBodyZones().subscribe();
        },
        error: (err) => {
          console.error('Erreur lors de la suppression de la zone du corps', err);
        }
      });
    }
  }

  onSubmitCreateBodyZone(): void {
    if (this.createBodyZoneFormGroup.valid) {
      const payload = {
        name: this.createBodyZoneFormGroup.get('name')?.value || ''
      };

      this.securityService.createBodyZone(payload).subscribe({
        next: () => {
          this.handleClose();
          this.securityService.fetchBodyZones().subscribe();
        },
        error: (err) => {
          console.error('Erreur lors de la création de la zone du corps', err);
        }
      });
    }
  }

  onSubmitUpdateBodyZone(): void {
    if (this.updateBodyZoneFormGroup.valid && this.currentBodyZone) {
      const payload = {
        body_zone_id: this.currentBodyZone.body_zone_id,
        name: this.updateBodyZoneFormGroup.get('name')?.value || ''
      };

      this.securityService.updateBodyZone(payload).subscribe({
        next: () => {
          this.handleClose();
          this.securityService.fetchBodyZones().subscribe();
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour de la zone du corps', err);
        }
      });
    }
  }
}
