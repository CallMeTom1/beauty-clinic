// manage-care-category.component.ts
import {Component, effect, inject, OnInit} from '@angular/core';
import {SecurityService} from "@feature-security";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {FormcontrolSimpleConfig, LabelWithParamComponent, LabelWithParamPipe} from "@shared-ui";
import {FloatingLabelInputTestComponent} from "../../../shared/ui/form/component/floating-label-input-test/floating-label-input-test.component";
import {ModalComponent} from "../../../shared/ui/modal/modal/modal.component";
import {NgClass} from "@angular/common";
import {CareCategory} from "../../../security/data/model/care-category/care-category.business";
import {
  SubCareCateogrySelectorForCareCategoryComponent
} from "../../../shared/ui/sub-care-cateogry-selector-for-care-category/sub-care-cateogry-selector-for-care-category.component";
import {lastValueFrom} from "rxjs";

@Component({
  selector: 'app-manage-care-category',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FloatingLabelInputTestComponent,
    TranslateModule,
    LabelWithParamComponent,
    LabelWithParamPipe,
    ModalComponent,
    NgClass,
    SubCareCateogrySelectorForCareCategoryComponent
  ],
  templateUrl: './manage-care-category.component.html',
  styleUrls: ['./manage-care-category.component.scss']
})
export class ManageCareCategoryComponent implements OnInit {
  protected securityService: SecurityService = inject(SecurityService);
  protected translateService: TranslateService = inject(TranslateService);

  public showEditModal = false;
  public showCreateModal = false;
  protected modal_edit_title: string = 'modal.edit_care_category_title';
  protected modal_create_title: string = 'modal.create_care_category_title';
  public showDeleteModal = false;
  public currentCategory: CareCategory | null = null;

  public createCategoryFormGroup: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(50),
    ]),
    description: new FormControl(''),
    isPublished: new FormControl(false)
  });

  public updateCategoryFormGroup: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(50),
    ]),
    description: new FormControl(''),
    isPublished: new FormControl(false)
  });

  public createCategoryFormControlConfigs: FormcontrolSimpleConfig[] = [
    {
      label: this.translateService.instant('form.care_category.name.label'),
      formControl: this.createCategoryFormGroup.get('name') as FormControl,
      inputType: 'text',
      placeholder: this.translateService.instant('form.care_category.create.name.placeholder')
    },
    {
      label: this.translateService.instant('form.care_category.description.label'),
      formControl: this.createCategoryFormGroup.get('description') as FormControl,
      inputType: 'text',
      placeholder: this.translateService.instant('form.care_category.create.description.placeholder')
    },
    {
      label: this.translateService.instant('form.care_category.published.label'),
      formControl: this.createCategoryFormGroup.get('isPublished') as FormControl,
      inputType: 'checkbox',
      placeholder: ''
    }
  ];

  public updateCategoryFormControlConfigs: FormcontrolSimpleConfig[] = [
    {
      label: this.translateService.instant('form.care_category.name.label'),
      formControl: this.updateCategoryFormGroup.get('name') as FormControl,
      inputType: 'text',
      placeholder: ''
    },
    {
      label: this.translateService.instant('form.care_category.description.label'),
      formControl: this.updateCategoryFormGroup.get('description') as FormControl,
      inputType: 'text',
      placeholder: ''
    },
    {
      label: this.translateService.instant('form.care_category.published.label'),
      formControl: this.updateCategoryFormGroup.get('isPublished') as FormControl,
      inputType: 'checkbox',
      placeholder: ''
    }
  ];

  ngOnInit() {
    this.securityService.fetchCareCategories().subscribe();
  }

  openEditModal(category: CareCategory): void {
    this.currentCategory = category;
    this.updateCategoryFormGroup.patchValue({
      name: category.name,
      description: category.description,
      isPublished: category.isPublished
    });
    this.showEditModal = true;
  }

  openDeleteModal(category: CareCategory): void {
    this.currentCategory = {...category};
    this.showDeleteModal = true;
  }

  openCreateModal(): void {
    this.createCategoryFormGroup.reset({
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

  deleteCategory(): void {
    if (this.currentCategory?.category_id) {
      const payload = {
        category_id: this.currentCategory.category_id
      };

      this.securityService.deleteCareCategory(payload).subscribe({
        next: () => {
          this.handleClose();
          this.currentCategory = null;
          this.securityService.fetchCareCategories().subscribe();
        },
        error: (err) => {
          console.error('Erreur lors de la suppression de la catégorie', err);
        }
      });
    }
  }

  onSubmitCreateCategory(): void {
    if (this.createCategoryFormGroup.valid) {
      const payload = {
        name: this.createCategoryFormGroup.get('name')?.value || '',
        description: this.createCategoryFormGroup.get('description')?.value || '',
        isPublished: this.createCategoryFormGroup.get('isPublished')?.value
      };

      this.securityService.createCareCategory(payload).subscribe({
        next: () => {
          this.handleClose();
          this.securityService.fetchCareCategories().subscribe();
        },
        error: (err) => {
          console.error('Erreur lors de la création de la catégorie', err);
        }
      });
    }
  }

  onSubmitUpdateCategory(): void {
    if (this.updateCategoryFormGroup.valid && this.currentCategory) {
      const payload = {
        category_id: this.currentCategory.category_id,
        name: this.updateCategoryFormGroup.get('name')?.value || '',
        description: this.updateCategoryFormGroup.get('description')?.value || '',
        isPublished: this.updateCategoryFormGroup.get('isPublished')?.value
      };

      this.securityService.updateCareCategory(payload).subscribe({
        next: () => {
          this.handleClose();
          this.securityService.fetchCareCategories().subscribe();
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour de la catégorie', err);
        }
      });
    }
  }

  togglePublishCategory(category: CareCategory): void {
    const payload = {
      category_id: category.category_id,
      isPublished: !category.isPublished
    };

    this.securityService.updateCareCategory(payload).subscribe({
      next: () => {
        this.securityService.fetchCareCategories().subscribe();
      },
      error: (err) => {
        console.error('Erreur lors du changement de statut de la catégorie', err);
      }
    });
  }

  protected CareCategoryImageForm: FormGroup = new FormGroup({
    careCategoryImage: new FormControl(null, Validators.required)
  });

// Ajoutez la méthode pour gérer le changement d'image
  onCareCategoryImageChange(event: any, category: CareCategory): void {
    const file: File | undefined = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.CareCategoryImageForm.patchValue({
        careCategoryImage: file
      });
      this.uploadCareCategoryImage(category).then();
    }
  }

// Ajoutez la méthode pour uploader l'image
  async uploadCareCategoryImage(category: CareCategory): Promise<void> {
    if (this.CareCategoryImageForm.valid) {
      const formData: FormData = new FormData();
      const careCategoryImage = this.CareCategoryImageForm.get('careCategoryImage')?.value;

      if (careCategoryImage) {
        // Changez 'category_image' en 'categoryImage' pour correspondre au FileInterceptor
        formData.append('categoryImage', careCategoryImage);
        formData.append('category_id', category.category_id);

        try {
          await lastValueFrom(this.securityService.uploadCareCategoryImage(formData));
        } catch (error) {
          console.error('Erreur lors de la mise à jour de l\'image de la catégorie', error);
        }
      }
    }
  }

// Ajoutez la méthode pour obtenir l'image
  getCareCategoryImage(category: CareCategory): string {
    if (category.category_image && typeof category.category_image === 'string') {
      return category.category_image;
    } else {
      return './assets/default-category.png';
    }
  }
}
