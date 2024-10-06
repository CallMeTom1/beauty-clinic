import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {SecurityService} from "@feature-security";
import {ApiResponse} from "@shared-api";
import {AppNode, AppRoutes} from "@shared-routes";

@Component({
  selector: 'app-confirm-mail-page',
  standalone: true,
  imports: [],
  templateUrl: './confirm-mail-page.component.html',
  styleUrl: './confirm-mail-page.component.scss'
})
export class ConfirmMailPageComponent implements OnInit {
  verificationStatus: 'pending' | 'success' | 'error' = 'pending';
  message: string = '';

  constructor(
    private route: ActivatedRoute,
    private securityService: SecurityService,

  ) {}

  ngOnInit(): void {
    console.log('ConfirmMailPageComponent initialized');
    const token: string = this.route.snapshot.queryParams['token'];
    if (token) {
      this.securityService.verifyEmail(token).subscribe({
        next: (response: ApiResponse) => {
          this.verificationStatus = 'success';
          this.message = 'Votre adresse email a été vérifiée avec succès.';
          // Rediriger après un délai si nécessaire
          setTimeout(() => {
            this.goHome();
          }, 1000000);
        },
        error: (error) => {
          this.verificationStatus = 'error';
          if (error.status === 400) {
            this.message = 'Le lien de vérification est invalide ou a expiré.';
          } else {
            this.message = 'Une erreur est survenue. Veuillez réessayer plus tard.';
          }
        }
      });
    } else {
      this.verificationStatus = 'error';
      this.message = 'Aucun token de vérification trouvé dans l\'URL.';
    }
  }

  goHome(): void {
    this.securityService.navigate(AppNode.HOME)
  }

}
