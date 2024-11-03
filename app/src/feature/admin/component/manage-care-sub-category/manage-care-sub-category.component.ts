import {Component, inject, OnInit} from '@angular/core';
import {SecurityService} from "@feature-security";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {FormcontrolSimpleConfig, LabelWithParamComponent, LabelWithParamPipe} from "@shared-ui";
import {FloatingLabelInputTestComponent} from "../../../shared/ui/form/component/floating-label-input-test/floating-label-input-test.component";
import {ModalComponent} from "../../../shared/ui/modal/modal/modal.component";
import {NgClass} from "@angular/common";
import {CareSubCategory} from "../../../security/data/model/care-sub-category/care-sub-category.business";
import {lastValueFrom} from "rxjs";

@Component({
  selector: 'app-manage-care-sub-category',
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
  templateUrl: './manage-care-sub-category.component.html',
  styleUrls: ['./manage-care-sub-category.component.scss']
})
export class ManageCareSubCategoryComponent implements OnInit {
  protected securityService: SecurityService = inject(SecurityService);
  protected translateService: TranslateService = inject(TranslateService);

  public showEditModal = false;
  public showCreateModal = false;
  protected modal_edit_title: string = 'modal.edit_care_sub_category_title';
  protected modal_create_title: string = 'modal.create_care_sub_category_title';
  public showDeleteModal = false;
  public currentSubCategory: CareSubCategory | null = null;

  public createSubCategoryFormGroup: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(50),
    ]),
    description: new FormControl(''),
    isPublished: new FormControl(false)
  });

  public updateSubCategoryFormGroup: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(50),
    ]),
    description: new FormControl(''),
    isPublished: new FormControl(false)
  });

  public createSubCategoryFormControlConfigs: FormcontrolSimpleConfig[] = [
    {
      label: this.translateService.instant('form.care_sub_category.name.label'),
      formControl: this.createSubCategoryFormGroup.get('name') as FormControl,
      inputType: 'text',
      placeholder: this.translateService.instant('form.care_sub_category.create.name.placeholder')
    },
    {
      label: this.translateService.instant('form.care_sub_category.description.label'),
      formControl: this.createSubCategoryFormGroup.get('description') as FormControl,
      inputType: 'text',
      placeholder: this.translateService.instant('form.care_sub_category.create.description.placeholder')
    },
    {
      label: this.translateService.instant('form.care_sub_category.published.label'),
      formControl: this.createSubCategoryFormGroup.get('isPublished') as FormControl,
      inputType: 'checkbox',
      placeholder: ''
    }
  ];

  public updateSubCategoryFormControlConfigs: FormcontrolSimpleConfig[] = [
    {
      label: this.translateService.instant('form.care_sub_category.name.label'),
      formControl: this.updateSubCategoryFormGroup.get('name') as FormControl,
      inputType: 'text',
      placeholder: ''
    },
    {
      label: this.translateService.instant('form.care_sub_category.description.label'),
      formControl: this.updateSubCategoryFormGroup.get('description') as FormControl,
      inputType: 'text',
      placeholder: ''
    },
    {
      label: this.translateService.instant('form.care_sub_category.published.label'),
      formControl: this.updateSubCategoryFormGroup.get('isPublished') as FormControl,
      inputType: 'checkbox',
      placeholder: ''
    }
  ];

  ngOnInit() {
    this.securityService.fetchCareSubCategories().subscribe();
  }

  openEditModal(subCategory: CareSubCategory): void {
    this.currentSubCategory = subCategory;
    this.updateSubCategoryFormGroup.patchValue({
      name: subCategory.name,
      description: subCategory.description,
      isPublished: subCategory.isPublished
    });
    this.showEditModal = true;
  }

  openDeleteModal(subCategory: CareSubCategory): void {
    this.currentSubCategory = {...subCategory};
    this.showDeleteModal = true;
  }

  openCreateModal(): void {
    this.createSubCategoryFormGroup.reset({
      name: '',
      description: '',
      isPublished: false
    });
    this.showCreateModal = true;
  }

  handleClose(): void {
    this.showEditModal = false;
    this.showCreateModal = false;
    this.showDeleteModal = false;
  }

  deleteSubCategory(): void {
    if (this.currentSubCategory?.sub_category_id) {
      const payload = {
        sub_category_id: this.currentSubCategory.sub_category_id
      };

      this.securityService.deleteCareSubCategory(payload).subscribe({
        next: () => {
          this.handleClose();
          this.currentSubCategory = null;
          this.securityService.fetchCareSubCategories().subscribe();
        },
        error: (err) => {
          console.error('Erreur lors de la suppression de la sous-catégorie', err);
        }
      });
    }
  }

  onSubmitCreateSubCategory(): void {
    if (this.createSubCategoryFormGroup.valid) {
      const payload = {
        name: this.createSubCategoryFormGroup.get('name')?.value || '',
        description: this.createSubCategoryFormGroup.get('description')?.value || '',
        isPublished: this.createSubCategoryFormGroup.get('isPublished')?.value
      };

      this.securityService.createCareSubCategory(payload).subscribe({
        next: () => {
          this.handleClose();
          this.securityService.fetchCareSubCategories().subscribe();
        },
        error: (err) => {
          console.error('Erreur lors de la création de la sous-catégorie', err);
        }
      });
    }
  }

  onSubmitUpdateSubCategory(): void {
    if (this.updateSubCategoryFormGroup.valid && this.currentSubCategory) {
      const payload = {
        sub_category_id: this.currentSubCategory.sub_category_id,
        name: this.updateSubCategoryFormGroup.get('name')?.value || '',
        description: this.updateSubCategoryFormGroup.get('description')?.value || '',
        isPublished: this.updateSubCategoryFormGroup.get('isPublished')?.value
      };

      this.securityService.updateCareSubCategory(payload).subscribe({
        next: () => {
          this.handleClose();
          this.securityService.fetchCareSubCategories().subscribe();
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour de la sous-catégorie', err);
        }
      });
    }
  }

  togglePublishSubCategory(subCategory: CareSubCategory): void {
    const payload = {
      sub_category_id: subCategory.sub_category_id,
      isPublished: !subCategory.isPublished
    };

    this.securityService.updateCareSubCategory(payload).subscribe({
      next: () => {
        this.securityService.fetchCareSubCategories().subscribe();
      },
      error: (err) => {
        console.error('Erreur lors du changement de statut de la sous-catégorie', err);
      }
    });
  }

  protected SubCategoryImageForm: FormGroup = new FormGroup({
    subCategoryImage: new FormControl(null, Validators.required)
  });

// Ajoutez la méthode pour gérer le changement d'image
  onSubCategoryImageChange(event: any, subCategory: CareSubCategory): void {
    const file: File | undefined = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.SubCategoryImageForm.patchValue({
        subCategoryImage: file
      });
      this.uploadSubCategoryImage(subCategory).then();
    }
  }

// Ajoutez la méthode pour uploader l'image
  async uploadSubCategoryImage(subCategory: CareSubCategory): Promise<void> {
    if (this.SubCategoryImageForm.valid) {
      const formData: FormData = new FormData();
      const subCategoryImage = this.SubCategoryImageForm.get('subCategoryImage')?.value;

      if (subCategoryImage) {
        // Correction du nom du champ pour correspondre au FileInterceptor
        formData.append('categoryImage', subCategoryImage);
        // Correction du nom du champ pour correspondre au DTO
        formData.append('sub_category_id', subCategory.sub_category_id);

        try {
          await lastValueFrom(this.securityService.uploadCareSubCategoryImage(formData));
        } catch (error) {
          console.error('Erreur lors de la mise à jour de l\'image de la sous-catégorie', error);
        }
      }
    }
  }

// Ajoutez la méthode pour obtenir l'image
  getSubCategoryImage(subCategory: CareSubCategory): string {
    if (subCategory.sub_category_image && typeof subCategory.sub_category_image === 'string') {
      return subCategory.sub_category_image;
    } else {
      return './assets/default-category.png';
    }
  }
}
