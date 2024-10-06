import {
  AfterViewInit,
  Component, effect,
  inject,
} from '@angular/core';
import { environment } from "@env";

declare var google: any;

@Component({
  selector: 'app-google-button',
  templateUrl: './google-button.component.html',
  standalone: true,
  styleUrls: ['./google-button.component.scss']
})
export class GoogleButtonComponent implements AfterViewInit {

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

  handleCredentialResponse(response: any) {
    console.log('Credential response received:', response);

    // Envoyer le jeton JWT au serveur
    fetch('https://localhost:2024/api/account/google-signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ credential: response.credential })
    })
      .then(async res => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text);
        }
        return res.json();
      })
      .then(data => {
        console.log('Server response:', data);
      })
      .catch(error => {
        console.error('Error sending credential to server:', error);
      });
  }
}
