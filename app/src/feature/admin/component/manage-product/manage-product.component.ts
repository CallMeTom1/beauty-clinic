import {Component, effect, inject, OnInit} from '@angular/core';
import {SecurityService} from "@feature-security";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {FormcontrolSimpleConfig, LabelWithParamComponent, LabelWithParamPipe} from "@shared-ui";
import {Product} from "../../../security/data/model/product/product.business";
import {lastValueFrom} from 'rxjs';
import {
  FloatingLabelInputTestComponent
} from "../../../shared/ui/form/component/floating-label-input-test/floating-label-input-test.component";
import {ModalComponent} from "../../../shared/ui/modal/modal/modal.component";
import {
  RemoveProductPayload
} from "../../../security/data/payload/product/remove-product.payload";
import {CreateProductPayload} from "../../../security/data/payload/product/create-product.payload";
import {CategoryProduct} from "../../../security/data/model/category-product/category-product.business";
import {NgForOf} from "@angular/common";
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
    ProductCategorySelectorComponent
  ],
  templateUrl: './manage-product.component.html',
  styleUrl: './manage-product.component.scss'
})
export class ManageProductComponent implements OnInit {

  protected securityService: SecurityService = inject(SecurityService);
  protected translateService: TranslateService = inject(TranslateService);
  public showEditModal = false;
  public showCreateModal = false;
  protected modal_edit_title: string = 'Editer un produit';
  protected modal_create_title: string = 'Créer un produit';
  public showDeleteModal = false;
  public currentProduct: Product | null = null;
  public categories: CategoryProduct[] | null = null

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
    price: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')
    ]),
    quantity_stored: new FormControl('', [
      Validators.required,
      Validators.min(1),
      Validators.pattern('^[0-9]*$')
    ]),
    promo_percentage: new FormControl('', [
      Validators.min(0),
      Validators.max(100),
      Validators.pattern('^[0-9]*$')
    ])
  });

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
    price: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')
    ]),
    quantity_stored: new FormControl('', [
      Validators.required,
      Validators.min(1),
      Validators.pattern('^[0-9]*$')
    ]),
    promo_percentage: new FormControl('', [
      Validators.min(0),
      Validators.max(100),
      Validators.pattern('^[0-9]*$')
    ]),
  });

  // Formulaire pour gérer l'image de la catégorie de produit
  protected ProductImageForm: FormGroup = new FormGroup({
    productImage: new FormControl(null, Validators.required)
  });

  // Configurations de formulaires pour les produits
  public createProductFormControlConfigs: FormcontrolSimpleConfig[] = [
    {
      label: this.translateService.instant('form.product.name.label'),
      formControl: this.createProductFormGroup.get('name') as FormControl,
      inputType: 'text',
      placeholder: ''
    },
    {
      label: this.translateService.instant('form.product.description.label'),
      formControl: this.createProductFormGroup.get('description') as FormControl,
      inputType: 'textarea',
      placeholder: ''
    },
    {
      label: this.translateService.instant('form.product.price.label'),
      formControl: this.createProductFormGroup.get('price') as FormControl,
      inputType: 'number',
      placeholder: ''
    },
    {
      label: this.translateService.instant('form.product.quantity.label'),
      formControl: this.createProductFormGroup.get('quantity_stored') as FormControl,
      inputType: 'number',
      placeholder: ''
    },
    {
      label: this.translateService.instant('form.product.promo_percentage.label'),
      formControl: this.createProductFormGroup.get('promo_percentage') as FormControl,
      inputType: 'number',
      placeholder: ''
    }
  ];

  // Configurations de formulaires pour les produits
  public updateProductFormControlConfigs: FormcontrolSimpleConfig[] = [
    {
      label: this.translateService.instant('form.product.name.label'),
      formControl: this.createProductFormGroup.get('name') as FormControl,
      inputType: 'text',
      placeholder: ''
    },
    {
      label: this.translateService.instant('form.product.description.label'),
      formControl: this.createProductFormGroup.get('description') as FormControl,
      inputType: 'textarea',
      placeholder: ''
    },
    {
      label: this.translateService.instant('form.product.price.label'),
      formControl: this.createProductFormGroup.get('price') as FormControl,
      inputType: 'number',
      placeholder: ''
    },
    {
      label: this.translateService.instant('form.product.quantity.label'),
      formControl: this.createProductFormGroup.get('quantity_stored') as FormControl,
      inputType: 'number',
      placeholder: ''
    },
    {
      label: this.translateService.instant('form.product.promo_percentage.label'),
      formControl: this.createProductFormGroup.get('promo_percentage') as FormControl,
      inputType: 'number',
      placeholder: ''
    },
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
      price: product.price,
      quantity_stored: product.quantity_stored,
      promo_percentage: product.promo_percentage,
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
      const payload: RemoveProductPayload = { id: this.currentProduct.product_id };

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
    this.currentProduct = product; // Stocker le produit sélectionné

    this.updateProductFormGroup.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      quantity_stored: product.quantity_stored,
      promo_percentage: product.promo_percentage,
    });

    // Mettre à jour les placeholders, en convertissant les valeurs numériques en chaînes
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
        label: this.translateService.instant('form.product.price.label'),
        formControl: this.updateProductFormGroup.get('price') as FormControl,
        inputType: 'number',
        placeholder: product.price.toString() // Convertir le nombre en string
      },
      {
        label: this.translateService.instant('form.product.quantity.label'),
        formControl: this.updateProductFormGroup.get('quantity_stored') as FormControl,
        inputType: 'number',
        placeholder: product.quantity_stored.toString() // Convertir le nombre en string
      },
      {
        label: this.translateService.instant('form.product.promo_percentage.label'),
        formControl: this.updateProductFormGroup.get('promo_percentage') as FormControl,
        inputType: 'number',
        placeholder: product.promo_percentage.toString() // Convertir le nombre en string
      },
    ];
  }

  // Soumettre le formulaire de création de produit
  // Soumettre le formulaire de création de produit
  onSubmitCreateProduct(): void {
    if (this.createProductFormGroup.valid) {
      // Récupérer les valeurs et les convertir explicitement en nombres
      const payload: CreateProductPayload = {
        name: this.createProductFormGroup.get('name')?.value,
        description: this.createProductFormGroup.get('description')?.value,
        price: parseFloat(this.createProductFormGroup.get('price')?.value), // Conversion en nombre flottant
        quantity_stored: parseInt(this.createProductFormGroup.get('quantity_stored')?.value, 10), // Conversion en entier
        promo_percentage: parseFloat(this.createProductFormGroup.get('promo_percentage')?.value), // Conversion en nombre flottant
      };

      // Appeler le service pour créer le produit
      this.securityService.createProduct(payload).subscribe({
        next: (response) => {
          console.log('Produit créé avec succès', response);
          this.securityService.fetchProducts().subscribe(); // Rafraîchir la liste des produits
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
      const category_ids = this.updateProductFormGroup.get('category_names')?.value || [];
      const payload = {
        id: this.currentProduct.product_id, // Utiliser l'ID du produit sélectionné
        name: this.updateProductFormGroup.get('name')?.value,
        description: this.updateProductFormGroup.get('description')?.value,
        price: this.updateProductFormGroup.get('price')?.value,
        quantity_stored: this.updateProductFormGroup.get('quantity_stored')?.value,
        promo_percentage: this.updateProductFormGroup.get('promo_percentage')?.value,
      };

      this.securityService.updateProduct(payload).subscribe({
        next: (response) => {
          console.log('Produit mis à jour avec succès', response);
          this.securityService.fetchProducts().subscribe(); // Rafraîchir la liste des produits
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
      id: product.product_id
    };

    if (product.isPublished) {
      // Si le produit est déjà publié, on le dépublie
      this.securityService.unpublishProduct(payload).subscribe({
        next: (response) => {
          console.log('Produit dépublié avec succès', response);
          this.securityService.fetchProducts().subscribe(); // Rafraîchir la liste des produits
        },
        error: (err) => {
          console.error('Erreur lors de la dépublication du produit', err);
        }
      });
    } else {
      // Si le produit n'est pas publié, on le publie
      this.securityService.publishProduct(payload).subscribe({
        next: (response) => {
          console.log('Produit publié avec succès', response);
          this.securityService.fetchProducts().subscribe(); // Rafraîchir la liste des produits
        },
        error: (err) => {
          console.error('Erreur lors de la publication du produit', err);
        }
      });
    }
  }

  getProductImage(product: Product): string {
    if (product.product_image && typeof product.product_image === 'string') {
      // Si l'image est déjà encodée en base64, on la retourne directement
      return product.product_image;
    } else {
      // Si aucune image n'est disponible, on retourne une image par défaut
      return './assets/default-category.png';
    }
  }

  getCategoryNamesControl(): FormControl {
    return this.createProductFormGroup.get('category_names') as FormControl;
  }



}
