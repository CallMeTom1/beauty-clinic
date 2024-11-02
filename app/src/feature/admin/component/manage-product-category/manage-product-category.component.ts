import {Component, effect, inject, OnInit} from '@angular/core';
import {SecurityService} from "@feature-security";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {FormcontrolSimpleConfig, LabelWithParamComponent, LabelWithParamPipe} from "@shared-ui";
import {CategoryProduct} from "../../../security/data/model/category-product/category-product.business";
import {lastValueFrom, Observable} from 'rxjs';
import {
  FloatingLabelInputTestComponent
} from "../../../shared/ui/form/component/floating-label-input-test/floating-label-input-test.component";
import {ModalComponent} from "../../../shared/ui/modal/modal/modal.component";
import {
  RemoveCategoryProductPayload
} from "../../../security/data/payload/category-product/remove-category-product.payload";
import {
  CreateCategoryProductPayload
} from "../../../security/data/payload/category-product/create-category-product.payload";
import {
  UpdateCategoryProductPayload
} from "../../../security/data/payload/category-product/update-category-product.payload";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-manage-product-category',
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
  templateUrl: './manage-product-category.component.html',
  styleUrl: './manage-product-category.component.scss'
})
export class ManageProductCategoryComponent implements OnInit{

  protected securityService: SecurityService = inject(SecurityService);
  protected translateService: TranslateService = inject(TranslateService);
  public showEditModal = false;
  public showCreateModal = false;
  protected modal_edit_title: string = 'modal.edit_category_title';
  protected modal_create_title: string = 'modal.create_category_title';
  public showDeleteModal = false;
  public currentCategory: CategoryProduct | null = null;

  // Formulaire pour créer une catégorie de produit
  public createCategoryProductFormGroup: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(50),
    ]),
    description: new FormControl(''),
    isPublished: new FormControl(false)
  });


  // Formulaire pour mettre à jour une catégorie de produit
  public updateCategoryProductFormGroup: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(50),
    ]),
    description: new FormControl(''),
    isPublished: new FormControl(false)
  });

  // Configurations de formulaires
  public createCategoryFormControlConfigs: FormcontrolSimpleConfig[] = [
    {
      label: this.translateService.instant('form.category.product.name.label'),
      formControl: this.createCategoryProductFormGroup.get('name') as FormControl,
      inputType: 'text',
      placeholder: this.translateService.instant('form.category.create.name.placeholder')
    },
    {
      label: this.translateService.instant('form.category.product.description.label'),
      formControl: this.createCategoryProductFormGroup.get('description') as FormControl,
      inputType: 'text',
      placeholder: this.translateService.instant('form.category.create.description.placeholder')
    },
    {
      label: this.translateService.instant('form.category.product.published.label'),
      formControl: this.createCategoryProductFormGroup.get('isPublished') as FormControl,
      inputType: 'checkbox',
      placeholder: ''
    }
  ];

  public updateCategoryFormControlConfigs: FormcontrolSimpleConfig[] = [
    {
      label: this.translateService.instant('form.category.product.name.label'),
      formControl: this.updateCategoryProductFormGroup.get('name') as FormControl,
      inputType: 'text',
      placeholder: ''
    },
    {
      label: this.translateService.instant('form.category.product.description.label'),
      formControl: this.updateCategoryProductFormGroup.get('description') as FormControl,
      inputType: 'text',
      placeholder: ''
    },
    {
      label: this.translateService.instant('form.category.product.published.label'),
      formControl: this.updateCategoryProductFormGroup.get('isPublished') as FormControl,
      inputType: 'checkbox',
      placeholder: ''
    }
  ];



  constructor() {
    // Utilisation de 'effect' pour surveiller les changements sur 'CategoryProducts$'
    effect(() => {
      const categories: CategoryProduct[] = this.securityService.CategoryProducts$();
      if (categories.length > 0) {
        this.updateFormWithCategoryData(categories[0]); // Pour l'exemple, utiliser la première catégorie
      }
    });
  }

  ngOnInit() {
    this.securityService.fetchCategoryProducts().subscribe()
  }

  // Méthode pour ouvrir le modal d'édition
  openEditModal(category: CategoryProduct): void {
    this.currentCategory = category;
    this.updateCategoryProductFormGroup.patchValue({ name: category.name });
    this.showEditModal = true;
  }

  openDeleteModal(category: CategoryProduct): void {
    // Faire une copie de la catégorie pour éviter les modifications non voulues
    this.currentCategory = {...category};
    this.showDeleteModal = true;
  }

  openCreateModal(): void {
    // Réinitialiser le formulaire de création
    this.createCategoryProductFormGroup.reset({
      name: '',
      description: '',
      isPublished: false
    });
    this.showCreateModal = true;
  }

  // Fermer les modals
  handleClose(): void {
    this.showEditModal = false;
    this.showCreateModal = false;
    this.showDeleteModal = false;
  }

  // Supprimer la catégorie sélectionnée
  deleteCategory(): void {
    console.log('Deleting category:', this.currentCategory);
    if (!this.currentCategory?.product_category_id) {
      console.error('Erreur: ID de catégorie invalide ou manquant');
      return;
    }

    const payload: RemoveCategoryProductPayload = {
      id: this.currentCategory.product_category_id
    };

    console.log('Delete payload:', payload);

    this.securityService.deleteCategoryProduct(payload).subscribe({
      next: (response) => {
        console.log('Catégorie supprimée avec succès', response);
        this.handleClose();
        // Réinitialiser currentCategory après la suppression
        this.currentCategory = null;
        this.securityService.fetchCategoryProducts().subscribe();
      },
      error: (err) => {
        console.error('Erreur lors de la suppression de la catégorie de produit', err);
      }
    });
  }

  // Mettre à jour les valeurs du formulaire avec les données de la catégorie sélectionnée
  private updateFormWithCategoryData(cat: CategoryProduct): void {
    this.currentCategory = cat;

    this.updateCategoryProductFormGroup.patchValue({
      name: cat.name,
      description: cat.description,
      isPublished: cat.isPublished
    });

    // Mettre à jour les placeholders
    this.updateCategoryFormControlConfigs = [
      {
        label: this.translateService.instant('form.category.product.name.label'),
        formControl: this.updateCategoryProductFormGroup.get('name') as FormControl,
        inputType: 'text',
        placeholder: cat.name,
      },
      {
        label: this.translateService.instant('form.category.product.description.label'),
        formControl: this.updateCategoryProductFormGroup.get('description') as FormControl,
        inputType: 'text',
        placeholder: cat.description || '',
      },
      {
        label: this.translateService.instant('form.category.product.published.label'),
        formControl: this.updateCategoryProductFormGroup.get('isPublished') as FormControl,
        inputType: 'checkbox',
        placeholder: ''
      }
    ];
  }

  // Soumettre le formulaire de création de catégorie
  onSubmitCreateCategory(): void {
    if (this.createCategoryProductFormGroup.valid) {
      const payload: CreateCategoryProductPayload = {
        name: this.createCategoryProductFormGroup.get('name')?.value || '',
        description: this.createCategoryProductFormGroup.get('description')?.value || '',
        isPublished: this.createCategoryProductFormGroup.get('isPublished')?.value
      };
      console.log('create', payload)

      this.securityService.createCategoryProduct(payload).subscribe({
        next: (response) => {
          console.log('Catégorie de produit créée avec succès', response);
          this.handleClose();
          this.securityService.fetchCategoryProducts().subscribe();
        },
        error: (err) => {
          console.error('Erreur lors de la création de la catégorie de produit', err);
        }
      });
    }
  }

  // Soumettre le formulaire de mise à jour de la catégorie
  onSubmitUpdateCategory(): void {
    if (this.updateCategoryProductFormGroup.valid && this.currentCategory) {
      const payload: UpdateCategoryProductPayload = {
        id: this.currentCategory.product_category_id,
        name: this.updateCategoryProductFormGroup.get('name')?.value || '',
        description: this.updateCategoryProductFormGroup.get('description')?.value || '',
        isPublished: this.createCategoryProductFormGroup.get('isPublished')?.value
      };

      this.securityService.updateCategoryProduct(payload).subscribe({
        next: (response) => {
          console.log('Catégorie de produit mise à jour avec succès', response);
          this.handleClose();
          this.securityService.fetchCategoryProducts().subscribe();
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour de la catégorie de produit', err);
        }
      });
    }
  }

  // Méthode pour publier ou dépublier une catégorie
  togglePublishCategory(category: CategoryProduct): void {
    const payload: UpdateCategoryProductPayload = {
      id: category.product_category_id,
      name: category.name || '',
      description: category.description || '',
      isPublished: !category.isPublished
    };

    this.securityService.updateCategoryProduct(payload).subscribe({
      next: (response) => {
        console.log(`Catégorie ${payload.isPublished ? 'publiée' : 'dépubliée'} avec succès`, response);
        this.securityService.fetchCategoryProducts().subscribe();
      },
      error: (err) => {
        console.error(`Erreur lors de la ${payload.isPublished ? 'publication' : 'dépublication'} de la catégorie`, err);
      }
    });
  }

}
