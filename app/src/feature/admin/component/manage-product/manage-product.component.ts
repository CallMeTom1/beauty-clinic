import {Component, effect, inject, OnInit} from '@angular/core';
import {SecurityService} from "@feature-security";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {
  CustomEuroPipe,
  FormcontrolSimpleConfig,
  LabelWithParamComponent,
  LabelWithParamPipe
} from "@shared-ui";
import {Product} from "../../../security/data/model/product/product.business";
import {catchError, EMPTY, lastValueFrom, switchMap, tap} from 'rxjs';
import {
  FloatingLabelInputTestComponent
} from "../../../shared/ui/form/component/floating-label-input-test/floating-label-input-test.component";
import {ModalComponent} from "../../../shared/ui/modal/modal/modal.component";
import {
  RemoveProductPayload
} from "../../../security/data/payload/product/remove-product.payload";
import {CreateProductPayload} from "../../../security/data/payload/product/create-product.payload";
import {CategoryProduct} from "../../../security/data/model/category-product/category-product.business";
import {CurrencyPipe, NgClass, NgForOf} from "@angular/common";
import {
  ProductCategorySelectorComponent
} from "../../../shared/ui/product-category-selector/product-category-selector.component";

@Component({
  selector: 'app-manage-product',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FloatingLabelInputTestComponent,
    TranslateModule,
    LabelWithParamComponent,
    LabelWithParamPipe,
    ModalComponent,
    NgForOf,
    ProductCategorySelectorComponent,
    CurrencyPipe,
    CustomEuroPipe,
    NgClass
  ],
  templateUrl: './manage-product.component.html',
  styleUrl: './manage-product.component.scss'
})
export class ManageProductComponent implements OnInit {

  protected securityService: SecurityService = inject(SecurityService);
  protected translateService: TranslateService = inject(TranslateService);
  public showEditModal = false;
  public showCreateModal = false;
  protected modal_edit_title: string = 'modal.edit.product.title';
  protected modal_create_title: string = 'modal.create.product.title';
  public showDeleteModal = false;
  public currentProduct: Product | null = null;
  public categories: CategoryProduct[] | null = null
  currentPromoProduct: Product | null = null;
  temporaryPromoPercentage: number = 0;
  protected readonly Math = Math;

  // Formulaire pour créer un produit
  public createProductFormGroup: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(100),
    ]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(500),
    ]),
    initial_price: new FormControl('', [
      Validators.required,
      Validators.min(0),
      Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')
    ]),
    quantity_stored: new FormControl('', [
      Validators.required,
      Validators.min(0),
      Validators.pattern('^[0-9]*$')
    ]),
    minQuantity: new FormControl('', [
      Validators.required,
      Validators.min(1),
      Validators.pattern('^[0-9]*$')
    ]),
    maxQuantity: new FormControl('', [
      Validators.required,
      Validators.min(1),
      Validators.pattern('^[0-9]*$')
    ]),
    is_promo: new FormControl(false),
    promo_percentage: new FormControl('', [
      Validators.min(0),
      Validators.max(100),
      Validators.pattern('^[0-9]*$')
    ]),
    isPublished: new FormControl(false)
  });

// Même structure pour updateProductFormGroup

  // Formulaire pour mettre à jour un produit
  public updateProductFormGroup: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(100),
    ]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(500),
    ]),
    initial_price: new FormControl('', [
      Validators.required,
      Validators.min(0),
      Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')
    ]),
    quantity_stored: new FormControl('', [
      Validators.required,
      Validators.min(0),
      Validators.pattern('^[0-9]*$')
    ]),
    minQuantity: new FormControl('', [
      Validators.required,
      Validators.min(1),
      Validators.pattern('^[0-9]*$')
    ]),
    maxQuantity: new FormControl('', [
      Validators.required,
      Validators.min(1),
      Validators.pattern('^[0-9]*$')
    ]),
    is_promo: new FormControl(false),
    promo_percentage: new FormControl('', [
      Validators.min(0),
      Validators.max(100),
      Validators.pattern('^[0-9]*$')
    ]),
    isPublished: new FormControl(false)
  });

  // Formulaire pour gérer l'image de la catégorie de produit
  protected ProductImageForm: FormGroup = new FormGroup({
    productImage: new FormControl(null, Validators.required)
  });

  public createProductFormControlConfigs: FormcontrolSimpleConfig[] = [
    {
      label: this.translateService.instant('form.product.name.label'),
      formControl: this.createProductFormGroup.get('name') as FormControl,
      inputType: 'text',
      placeholder: this.translateService.instant('form.product.name.placeholder')
    },
    {
      label: this.translateService.instant('form.product.description.label'),
      formControl: this.createProductFormGroup.get('description') as FormControl,
      inputType: 'textarea',
      placeholder: this.translateService.instant('form.product.description.placeholder')
    },
    {
      label: this.translateService.instant('form.product.initial_price.label'),
      formControl: this.createProductFormGroup.get('initial_price') as FormControl,
      inputType: 'number',
      placeholder: this.translateService.instant('form.product.initial_price.placeholder')
    },
    {
      label: this.translateService.instant('form.product.quantity_stored.label'),
      formControl: this.createProductFormGroup.get('quantity_stored') as FormControl,
      inputType: 'number',
      placeholder: this.translateService.instant('form.product.quantity_stored.placeholder')
    },
    {
      label: this.translateService.instant('form.product.minQuantity.label'),
      formControl: this.createProductFormGroup.get('minQuantity') as FormControl,
      inputType: 'number',
      placeholder: this.translateService.instant('form.product.minQuantity.placeholder')
    },
    {
      label: this.translateService.instant('form.product.maxQuantity.label'),
      formControl: this.createProductFormGroup.get('maxQuantity') as FormControl,
      inputType: 'number',
      placeholder: this.translateService.instant('form.product.maxQuantity.placeholder')
    },
    {
      label: this.translateService.instant('form.product.is_promo.label'),
      formControl: this.createProductFormGroup.get('is_promo') as FormControl,
      inputType: 'checkbox',
      placeholder: ''
    },
    {
      label: this.translateService.instant('form.product.promo_percentage.label'),
      formControl: this.createProductFormGroup.get('promo_percentage') as FormControl,
      inputType: 'number',
      placeholder: this.translateService.instant('form.product.promo_percentage.placeholder')
    },
    {
      label: this.translateService.instant('form.product.isPublished.label'),
      formControl: this.createProductFormGroup.get('isPublished') as FormControl,
      inputType: 'checkbox',
      placeholder: ''
    }
  ];

  // Configurations de formulaires pour les produits
  public updateProductFormControlConfigs: FormcontrolSimpleConfig[] = [
    {
      label: this.translateService.instant('form.product.name.label'),
      formControl: this.updateProductFormGroup.get('name') as FormControl,
      inputType: 'text',
      placeholder: ''
    },
    {
      label: this.translateService.instant('form.product.description.label'),
      formControl: this.updateProductFormGroup.get('description') as FormControl,
      inputType: 'textarea',
      placeholder: ''
    },
    {
      label: this.translateService.instant('form.product.initial_price.label'),
      formControl: this.updateProductFormGroup.get('initial_price') as FormControl,
      inputType: 'number',
      placeholder: ''
    },
    {
      label: this.translateService.instant('form.product.quantity_stored.label'),
      formControl: this.updateProductFormGroup.get('quantity_stored') as FormControl,
      inputType: 'number',
      placeholder: ''
    },
    {
      label: this.translateService.instant('form.product.minQuantity.label'),
      formControl: this.updateProductFormGroup.get('minQuantity') as FormControl,
      inputType: 'number',
      placeholder: ''
    },
    {
      label: this.translateService.instant('form.product.maxQuantity.label'),
      formControl: this.updateProductFormGroup.get('maxQuantity') as FormControl,
      inputType: 'number',
      placeholder: ''
    },
    {
      label: this.translateService.instant('form.product.is_promo.label'),
      formControl: this.updateProductFormGroup.get('is_promo') as FormControl,
      inputType: 'checkbox',
      placeholder: ''
    },
    {
      label: this.translateService.instant('form.product.promo_percentage.label'),
      formControl: this.updateProductFormGroup.get('promo_percentage') as FormControl,
      inputType: 'number',
      placeholder: ''
    },
    {
      label: this.translateService.instant('form.product.isPublished.label'),
      formControl: this.updateProductFormGroup.get('isPublished') as FormControl,
      inputType: 'checkbox',
      placeholder: ''
    }
  ];


  constructor() {
    // Utilisation de 'effect' pour surveiller les changements sur 'Products$'
    effect(() => {
      const products: Product[] = this.securityService.Products$();
      if (products.length > 0) {
        this.updateFormWithProductData(products[0]); // Pour l'exemple, utiliser le premier produit
      }
    });
  }

  ngOnInit() {
    this.securityService.fetchProducts().subscribe();
    this.categories = this.securityService.CategoryProducts$()
  }


  // Méthode pour ouvrir le modal d'édition
  openEditModal(product: Product): void {
    this.currentProduct = product;
    this.updateProductFormGroup.patchValue({
      name: product.name,
      description: product.description,
      initial_price: product.initial_price,
      quantity_stored: product.quantity_stored,
      minQuantity: product.minQuantity,
      maxQuantity: product.maxQuantity,
      is_promo: product.is_promo,
      promo_percentage: product.promo_percentage,
      isPublished: product.isPublished
    });
    this.showEditModal = true;
  }

  openDeleteModal(product: Product): void {
    this.currentProduct = product;
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

  // Supprimer le produit sélectionné
  deleteProduct(): void {

    if (this.currentProduct && this.currentProduct.product_id) {
      const payload: RemoveProductPayload = { product_id: this.currentProduct.product_id };
      console.log('payload', payload);

      this.securityService.deleteProduct(payload).subscribe({
        next: (response) => {
          console.log('Produit supprimé avec succès', response);
          this.securityService.fetchProducts().subscribe(); // Rafraîchir la liste des produits
          this.handleClose(); // Fermer le modal
        },
        error: (err) => {
          console.error('Erreur lors de la suppression du produit', err);
        }
      });
    } else {
      console.error('Erreur: Aucun produit ou ID de produit non valide pour la suppression.');
    }
  }

  // Mettre à jour les valeurs du formulaire avec les données du produit sélectionné
  private updateFormWithProductData(product: Product): void {
    this.currentProduct = product;

    this.updateProductFormGroup.patchValue({
      name: product.name,
      description: product.description,
      initial_price: product.initial_price,
      quantity_stored: product.quantity_stored,
      minQuantity: product.minQuantity,
      maxQuantity: product.maxQuantity,
      is_promo: product.is_promo,
      promo_percentage: product.promo_percentage,
      isPublished: product.isPublished
    });

    this.updateProductFormControlConfigs = [
      {
        label: this.translateService.instant('form.product.name.label'),
        formControl: this.updateProductFormGroup.get('name') as FormControl,
        inputType: 'text',
        placeholder: product.name
      },
      {
        label: this.translateService.instant('form.product.description.label'),
        formControl: this.updateProductFormGroup.get('description') as FormControl,
        inputType: 'textarea',
        placeholder: product.description
      },
      {
        label: this.translateService.instant('form.product.initial_price.label'),
        formControl: this.updateProductFormGroup.get('initial_price') as FormControl,
        inputType: 'number',
        placeholder: product.initial_price.toString()
      },
      {
        label: this.translateService.instant('form.product.quantity_stored.label'),
        formControl: this.updateProductFormGroup.get('quantity_stored') as FormControl,
        inputType: 'number',
        placeholder: product.quantity_stored.toString()
      },
      {
        label: this.translateService.instant('form.product.minQuantity.label'),
        formControl: this.updateProductFormGroup.get('minQuantity') as FormControl,
        inputType: 'number',
        placeholder: product.minQuantity.toString()
      },
      {
        label: this.translateService.instant('form.product.maxQuantity.label'),
        formControl: this.updateProductFormGroup.get('maxQuantity') as FormControl,
        inputType: 'number',
        placeholder: product.maxQuantity.toString()
      },
      {
        label: this.translateService.instant('form.product.is_promo.label'),
        formControl: this.updateProductFormGroup.get('is_promo') as FormControl,
        inputType: 'checkbox',
        placeholder: ''
      },
      {
        label: this.translateService.instant('form.product.promo_percentage.label'),
        formControl: this.updateProductFormGroup.get('promo_percentage') as FormControl,
        inputType: 'number',
        placeholder: product.promo_percentage.toString()
      },
      {
        label: this.translateService.instant('form.product.isPublished.label'),
        formControl: this.updateProductFormGroup.get('isPublished') as FormControl,
        inputType: 'checkbox',
        placeholder: ''
      }
    ];
  }

  // Soumettre le formulaire de création de produit
  // Soumettre le formulaire de création de produit
  onSubmitCreateProduct(): void {
    if (this.createProductFormGroup.valid) {
      const payload: CreateProductPayload = {
        name: this.createProductFormGroup.get('name')?.value || '',
        description: this.createProductFormGroup.get('description')?.value || '',
        initial_price: parseFloat(this.createProductFormGroup.get('initial_price')?.value),
        quantity_stored: parseInt(this.createProductFormGroup.get('quantity_stored')?.value),
        minQuantity: parseInt(this.createProductFormGroup.get('minQuantity')?.value),
        maxQuantity: parseInt(this.createProductFormGroup.get('maxQuantity')?.value),
        isPublished: this.createProductFormGroup.get('isPublished')?.value,
        promo_percentage: parseFloat(this.createProductFormGroup.get('promo_percentage')?.value || '0')
      };

      console.log('payload create prod', payload)

      this.securityService.createProduct(payload).subscribe({
        next: (response) => {
          this.handleClose();
          this.securityService.fetchProducts().subscribe();
        },
        error: (err) => {
          console.error('Erreur lors de la création du produit', err);
        }
      });
    }
  }



  // Soumettre le formulaire de mise à jour du produit
  onSubmitUpdateProduct(): void {
    if (this.updateProductFormGroup.valid && this.currentProduct) {
      const payload = {
        product_id: this.currentProduct.product_id,
        name: this.updateProductFormGroup.get('name')?.value,
        description: this.updateProductFormGroup.get('description')?.value,
        initial_price: parseFloat(this.updateProductFormGroup.get('initial_price')?.value),
        quantity_stored: parseInt(this.updateProductFormGroup.get('quantity_stored')?.value),
        minQuantity: parseInt(this.updateProductFormGroup.get('minQuantity')?.value),
        maxQuantity: parseInt(this.updateProductFormGroup.get('maxQuantity')?.value),
        is_promo: this.updateProductFormGroup.get('is_promo')?.value,
        promo_percentage: parseFloat(this.updateProductFormGroup.get('promo_percentage')?.value || '0'),
        isPublished: this.updateProductFormGroup.get('isPublished')?.value
      };

      this.securityService.updateProduct(payload).subscribe({
        next: (response) => {
          console.log('Produit mis à jour avec succès', response);
          this.handleClose();
          this.securityService.fetchProducts().subscribe();
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour du produit', err);
        }
      });
    }
  }

  // Gérer le changement d'image de produit avec deux paramètres : l'événement et le produit
  onProductImageChange(event: any, product: Product): void {
    const file: File | undefined = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.ProductImageForm.patchValue({
        productImage: file
      });
      this.uploadProductImage(product).then(); // Passe le produit à la méthode d'upload
    }
  }

  async uploadProductImage(product: Product): Promise<void> {
    if (this.ProductImageForm.valid) {
      const formData: FormData = new FormData();
      const productImage = this.ProductImageForm.get('productImage')?.value;

      if (productImage) {
        formData.append('productImage', productImage);
        formData.append('productId', product.product_id);

        try {
          await lastValueFrom(this.securityService.uploadProductImage(formData));
        } catch (error) {
          console.error('Erreur lors de la mise à jour de l\'image du produit', error);
        }
      }
    }
  }


  // Méthode pour publier ou dépublier un produit
  togglePublishProduct(product: Product): void {
    const payload = {
      product_id: product.product_id,
      isPublished: !product.isPublished // Inverse l'état actuel
    };

    // Utilise une seule méthode updateProduct plutôt que deux méthodes différentes
    this.securityService.updateProduct(payload)
      .pipe(
        // Si la mise à jour réussit, on enchaîne avec le rafraîchissement
        tap((response) => {
          console.log(
            `Produit ${payload.isPublished ? 'publié' : 'dépublié'} avec succès`,
            response
          );
        }),
        // Enchaîne directement avec le rafraîchissement
        switchMap(() => this.securityService.fetchProducts()),
        // Gestion des erreurs
        catchError((error) => {
          console.error(
            `Erreur lors de la ${payload.isPublished ? 'publication' : 'dépublication'} du produit`,
            error
          );
          // Retourne un observable vide pour ne pas bloquer la chaîne
          return EMPTY;
        })
      )
      .subscribe();
  }

  getProductImage(product: Product): string {
    if (product.product_image && typeof product.product_image === 'string') {
      // Si l'image est déjà encodée en base64, on la retourne directement
      return product.product_image;
    } else {
      // Si aucune image n'est disponible, on retourne une image par défaut
      return './assets/default-product.png';
    }
  }

  getCategoryNamesControl(): FormControl {
    return this.createProductFormGroup.get('category_names') as FormControl;
  }

  togglePromoPopover(product: Product): void {
    console.log('Toggle promo for product:', product); // Debug
    if (this.currentPromoProduct?.product_id === product.product_id) {
      this.currentPromoProduct = null;
    } else {
      this.currentPromoProduct = product;
      this.temporaryPromoPercentage = product.promo_percentage || 0;
    }
  }

  onPromoPercentageChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.temporaryPromoPercentage = parseInt(value) || 0;
  }

  applyPromotion(product: Product): void {
    const payload = {
      product_id: product.product_id,
      is_promo: true,
      promo_percentage: this.temporaryPromoPercentage
    };

    this.securityService.updateProduct(payload).subscribe({
      next: () => {
        this.currentPromoProduct = null;
        this.securityService.fetchProducts().subscribe();
      },
      error: (err) => {
        console.error('Erreur lors de l\'application de la promotion', err);
      }
    });
  }

  removePromotion(product: Product): void {
    const payload = {
      product_id: product.product_id,
      is_promo: false,
      promo_percentage: 0
    };

    this.securityService.updateProduct(payload).subscribe({
      next: () => {
        this.currentPromoProduct = null;
        this.securityService.fetchProducts().subscribe();
      },
      error: (err) => {
        console.error('Erreur lors de la suppression de la promotion', err);
      }
    });
  }



}
