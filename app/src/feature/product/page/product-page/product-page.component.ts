import {Component, inject, OnInit} from '@angular/core';
import {
  ProductCategoryListSelectorComponent
} from "../../component/product-category-list-selector/product-category-list-selector.component";
import {ProductSearchComponent} from "../../component/product-search/product-search.component";
import {ProductListComponent} from "../../component/product-list/product-list.component";
import {ModalComponent} from "../../../shared/ui/modal/modal/modal.component";
import {NgIf, ViewportScroller} from "@angular/common";
import {ModalService} from "../../../shared/ui/modal.service";
import {SecurityService} from "@feature-security";

@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [
    ProductCategoryListSelectorComponent,
    ProductSearchComponent,
    ProductListComponent,
    ModalComponent,
    NgIf
  ],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.scss'
})
export class ProductPageComponent implements OnInit {
  private readonly viewportScroller: ViewportScroller = inject(ViewportScroller);
  protected readonly modalService = inject(ModalService);
  protected readonly securityService = inject(SecurityService);

  ngOnInit() {
    this.viewportScroller.scrollToPosition([0, 0]);
  }

  closeAuthModal(): void {
    console.log('Closing modal');
    this.modalService.closeModal();
  }

  navigateToLogin(): void {
    this.closeAuthModal();
    this.securityService.navigate('/connexion');
  }

  navigateToRegister(): void {
    this.closeAuthModal();
    this.securityService.navigate('/inscription');
  }
}
