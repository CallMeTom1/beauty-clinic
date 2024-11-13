import {Component, HostListener, inject, OnInit} from '@angular/core';
import {SecurityService} from "@feature-security";
import {ProductCardComponent} from "../../../product/component/product-card/product-card.component";
import {BehaviorSubject} from "rxjs";
import {AsyncPipe, NgForOf, NgIf, ViewportScroller} from "@angular/common";
import {AppRoutes} from "@shared-routes";

@Component({
  selector: 'app-product-selection',
  standalone: true,
  imports: [
    ProductCardComponent,
    NgIf,
    AsyncPipe,
    NgForOf
  ],
  templateUrl: './product-selection.component.html',
  styleUrl: './product-selection.component.scss'
})
export class ProductSelectionComponent implements OnInit {
  private readonly viewportScroller: ViewportScroller = inject(ViewportScroller);
  protected securityService: SecurityService = inject(SecurityService);
  products: any[] = [];
  currentIndex = 0;
  itemsToShow = 3; // Par défaut, on affiche 3 éléments

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.updateItemsToShow();
  }

  ngOnInit() {
    // Appeler fetchProductsPublished et attendre la réponse
    this.securityService.fetchProductsPublished().subscribe({
      next: () => {
        this.products = this.securityService.ProductsPublished$();
        this.updateItemsToShow();

        // Utiliser setTimeout pour s'assurer que le DOM est mis à jour
        setTimeout(() => {
          this.viewportScroller.scrollToPosition([0, 0]);
        });
      }
    });
  }

  updateItemsToShow() {
    if (window.innerWidth <= 768) {
      this.itemsToShow = 1;
    } else if (window.innerWidth <= 1200) {
      this.itemsToShow = 2;
    } else {
      this.itemsToShow = 3;
    }
    this.currentIndex = 0; // Reset l'index quand on change le nombre d'éléments affichés
  }

  navigate(direction: number) {
    const totalSlides = Math.ceil(this.products.length / this.itemsToShow);
    this.currentIndex = (this.currentIndex + direction + totalSlides) % totalSlides;
  }

  getProgressWidth(): string {
    const totalSlides = Math.ceil(this.products.length / this.itemsToShow);
    const progressPercentage = ((this.currentIndex + 1) / totalSlides) * 100;
    return `${progressPercentage}%`;
  }

  navigateToProducts(): void {
    this.securityService.navigate(AppRoutes.PRODUCTS);
  }
}
