import {Component, Input} from '@angular/core';
import {NgClass} from "@angular/common";
import {NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs";
interface Step {
  name: string;
  completed: boolean;
  path: string;
}
@Component({
  selector: 'app-progress-steps',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './progress-steps.component.html',
  styleUrl: './progress-steps.component.scss'
})


export class ProgressStepsComponent {
  steps: Step[] = [
    { name: 'Panier', completed: false, path: '/cart' },
    { name: 'Livraison et Paiement', completed: false, path: '/cart/order/confirm' },
    { name: 'Commande validée', completed: false, path: '/cart/order/confirmed' }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    // Mettre à jour les étapes au chargement initial
    this.updateSteps(this.router.url);

    // Observer les changements de route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.updateSteps(event.url);
    });
  }

  private updateSteps(currentUrl: string) {
    let foundCurrent = false;

    this.steps = this.steps.map(step => {
      // Si on a déjà trouvé l'étape courante, les suivantes ne sont pas complétées
      if (foundCurrent) {
        return { ...step, completed: false };
      }

      // Si c'est l'étape courante
      if (currentUrl.includes(step.path)) {
        foundCurrent = true;
        return { ...step, completed: true };
      }

      // Si on n'a pas encore trouvé l'étape courante, les précédentes sont complétées
      return { ...step, completed: true };
    });
  }
}
