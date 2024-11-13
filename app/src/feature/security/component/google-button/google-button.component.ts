import {
  AfterViewInit,
  Component, effect,
  inject,
} from '@angular/core';
import { environment } from "@env";
import {SecurityService} from "@feature-security";
import {ApiResponse} from "@shared-api";
import {AppNode} from "@shared-routes";

declare var google: any;

@Component({
  selector: 'app-google-button',
  templateUrl: './google-button.component.html',
  standalone: true,
  styleUrls: ['./google-button.component.scss']
})
export class GoogleButtonComponent implements AfterViewInit {

  protected readonly securityService: SecurityService = inject(SecurityService);

  constructor() {
    effect(() => this.ngAfterViewInit());
  }

  ngAfterViewInit() {
    // Initialiser Google Sign-In après que la vue soit prête
    this.initializeGoogleSignIn();
  }

  initializeGoogleSignIn(): void {
    google.accounts.id.initialize({
      client_id: environment.GOOGLE_CLIENT,
      callback: this.handleCredentialResponse.bind(this),
      ux_mode: 'popup',
      auto_select: false,
    });

    // Rendre le bouton Google Sign-In
    google.accounts.id.renderButton(
      document.querySelector('.google-signin-button'),
      {
        type: 'standard',
        shape: 'square',
        theme: 'outline',
        text: 'continue_with',
        size: 'large',
        logo_alignment: 'left',
        width: 350,
      }
    );
  }

  async handleCredentialResponse(response: any) {
    try {
      console.log('Credential response received:', response);

      const serverResponse = await fetch('https://localhost:2024/api/account/google-signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ credential: response.credential }),
        credentials: 'include' // Important pour inclure les cookies
      });

      if (!serverResponse.ok) {
        const errorText = await serverResponse.text();
        throw new Error(errorText);
      }

      const data: ApiResponse = await serverResponse.json();
      console.log('Server response:', data);

      if (data.result) {
        // Mettre à jour l'état d'authentification
        this.securityService.setAuthState(true);

        // Récupérer les informations de l'utilisateur
        this.securityService.me().subscribe({
          next: (response: ApiResponse) => {
            if (response.result) {
              // Rediriger vers la page appropriée après la connexion réussie
              this.securityService.navigate(AppNode.REDIRECT_TO_AUTHENTICATED);
            }
          },
          error: (error) => {
            console.error('Error fetching user data:', error);
            this.securityService.error$.set('Erreur lors de la récupération des données utilisateur');
          }
        });
      }
    } catch (error) {
      console.error('Error during Google authentication:', error);
      this.securityService.error$.set('Erreur lors de l\'authentification Google');
    }
  }
}
