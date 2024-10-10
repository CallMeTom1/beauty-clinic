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

@Component({
  selector: 'app-manage-product-category',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FloatingLabelInputTestComponent,
    TranslateModule,
    LabelWithParamComponent,
    LabelWithParamPipe,
    ModalComponent
  ],
  templateUrl: './manage-product-category.component.html',
  styleUrl: './manage-product-category.component.scss'
})
export class ManageProductCategoryComponent implements OnInit{

  protected securityService: SecurityService = inject(SecurityService);
  protected translateService: TranslateService = inject(TranslateService);
  public showEditModal = false;
  public showCreateModal = false;
  protected modal_edit_title: string = 'Editer une catégorie';
  protected modal_create_title: string = 'Créer une catégorie';
  public showDeleteModal = false;
  public currentCategory: CategoryProduct | null = null;

  // Formulaire pour créer une catégorie de produit
  public createCategoryProductFormGroup: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(50),
    ]),
  });

  // Formulaire pour mettre à jour une catégorie de produit
  public updateCategoryProductFormGroup: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(50),
    ]),
  });

  // Configurations de formulaires
  public createCategoryFormControlConfigs: FormcontrolSimpleConfig[] = [
    {
      label: this.translateService.instant('form.category.product.name.label'),
      formControl: this.createCategoryProductFormGroup.get('name') as FormControl,
      inputType: 'text',
      placeholder: ''
    }
  ];

  public updateCategoryFormControlConfigs: FormcontrolSimpleConfig[] = [
    {
      label: this.translateService.instant('form.category.product.name.label'),
      formControl: this.updateCategoryProductFormGroup.get('name') as FormControl,
      inputType: 'text',
      placeholder: ''
    }
  ];

  // Formulaire pour gérer l'image de la catégorie de produit
  protected ProductCategoryImageForm: FormGroup = new FormGroup({
    productCategoryImage: new FormControl(null, Validators.required)
  });


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
    this.currentCategory = category;
    this.showDeleteModal = true;
  }

  openCreateModal(): void {
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
    if (this.currentCategory && this.currentCategory.product_category_id) {
      const payload: RemoveCategoryProductPayload = { id: this.currentCategory.product_category_id };

      this.securityService.deleteCategoryProduct(payload).subscribe({
        next: (response) => {
          console.log('Catégorie supprimée avec succès', response);
          this.securityService.fetchCategoryProducts().subscribe(); // Rafraîchir la liste des catégories
          this.handleClose(); // Fermer le modal
        },
        error: (err) => {
          console.error('Erreur lors de la suppression de la catégorie de produit', err);
        }
      });
    } else {
      console.error('Erreur: Aucune catégorie ou ID de catégorie non valide pour la suppression.');
    }
  }

  // Mettre à jour les valeurs du formulaire avec les données de la catégorie sélectionnée
  private updateFormWithCategoryData(cat: CategoryProduct): void {
    this.currentCategory = cat; // Stocker la catégorie sélectionnée

    this.updateCategoryProductFormGroup.patchValue({
      name: cat.name,
    });

    // Mettre à jour les placeholders
    this.updateCategoryFormControlConfigs = [
      {
        label: this.translateService.instant('form.category.product.name.label'),
        formControl: this.updateCategoryProductFormGroup.get('name') as FormControl,
        inputType: 'text',
        placeholder: cat.name,
      }
    ];
  }

  // Soumettre le formulaire de création de catégorie
  onSubmitCreateCategory(): void {
    console.log('ici')
    if (this.createCategoryProductFormGroup.valid) {
      // Créer le payload à partir des valeurs du formulaire
      const payload = {
        name: this.createCategoryProductFormGroup.get('name')?.value,
      };

      // Appeler la méthode pour créer une nouvelle catégorie
      this.securityService.createCategoryProduct(payload).subscribe({
        next: (response) => {
          console.log('Catégorie de produit créée avec succès', response);
          this.securityService.fetchCategoryProducts().subscribe(); // Rafraîchir la liste des catégories
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
      const payload = {
        id: this.currentCategory.product_category_id, // Utiliser l'ID de la catégorie sélectionnée
        name: this.updateCategoryProductFormGroup.get('name')?.value,
      };

      this.securityService.updateCategoryProduct(payload).subscribe({
        next: (response) => {
          console.log('Catégorie de produit mise à jour avec succès', response);
          this.securityService.fetchCategoryProducts().subscribe(); // Rafraîchir la liste des catégories
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour de la catégorie de produit', err);
        }
      });
    }
  }

  // Gérer le changement d'image de catégorie avec deux paramètres : l'événement et la catégorie
  onCategoryImageChange(event: any, category: CategoryProduct): void {
    const file: File | undefined = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.ProductCategoryImageForm.patchValue({
        productCategoryImage: file
      });
      this.uploadCategoryImage(category).then(); // Passe la catégorie à la méthode d'upload
    }
  }


  // Upload de l'image de catégorie avec la catégorie correspondante
  async uploadCategoryImage(category: CategoryProduct): Promise<void> {
    if (this.ProductCategoryImageForm.valid) {
      const formData: FormData = new FormData();
      const categoryImage = this.ProductCategoryImageForm.get('productCategoryImage')?.value;
      if (categoryImage) {
        formData.append('productCategoryImage', categoryImage);
        formData.append('categoryProductId', category.product_category_id); // Utiliser l'ID de la catégorie transmise

        try {
          await lastValueFrom(this.securityService.uploadCategoryProductImage(formData));
          location.reload(); // Rafraîchir pour afficher la nouvelle image
        } catch (error) {
          console.error('Erreur lors de la mise à jour de l\'image de la catégorie de produit', error);
        }
      }
    }
  }


  // Méthode pour publier ou dépublier une catégorie
  togglePublishCategory(category: CategoryProduct): void {
    const payload = {
      id: category.product_category_id
    };

    if (category.isPublished) {
      // Si la catégorie est déjà publiée, on la dépublie
      this.securityService.unpublishCategoryProduct(payload).subscribe({
        next: (response) => {
          console.log('Catégorie dépubliée avec succès', response);
          this.securityService.fetchCategoryProducts().subscribe(); // Rafraîchir la liste des catégories
        },
        error: (err) => {
          console.error('Erreur lors de la dépublication de la catégorie de produit', err);
        }
      });
    } else {
      // Si la catégorie n'est pas publiée, on la publie
      this.securityService.publishCategoryProduct(payload).subscribe({
        next: (response) => {
          console.log('Catégorie publiée avec succès', response);
          this.securityService.fetchCategoryProducts().subscribe(); // Rafraîchir la liste des catégories
        },
        error: (err) => {
          console.error('Erreur lors de la publication de la catégorie de produit', err);
        }
      });
    }
  }

  getCategoryImage(category: CategoryProduct): string {
    if (category.product_category_image && typeof category.product_category_image === 'string') {
      // Si l'image est déjà encodée en base64, on la retourne directement
      return category.product_category_image;
    } else {
      // Si aucune image n'est disponible, on retourne une image par défaut
      return './assets/default-category.png';
    }
  }

}
