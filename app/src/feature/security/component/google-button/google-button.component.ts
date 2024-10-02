import { Component } from '@angular/core';
import {environment} from "@env";

declare var google: any;

@Component({
  selector: 'app-google-button',
  standalone: true,
  imports: [],
  templateUrl: './google-button.component.html',
  styleUrl: './google-button.component.scss'
})
export class GoogleButtonComponent {
  ngOnInit() {
    // Initialiser Google Sign-In
    google.accounts.id.initialize({
      client_id: environment.GOOGLE_CLIENT,
      callback: this.handleCredentialResponse.bind(this),
      ux_mode: 'popup',
    });

    // Rendre le bouton Google Sign-In
    google.accounts.id.renderButton(
      document.getElementById('google-signin-button'),
      {
        theme: 'outline',
        size: 'large',
      }
    );
  }

  handleCredentialResponse(response: any) {
    console.log('Credential response received:', response);

    // Send the credential to your backend server
    fetch('https://localhost:2024/api/account/google-signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ credential: response.credential })
    })
      .then(res => {
        if (!res.ok) {
          // If response is not OK, get the error message
          return res.text().then(text => {
            throw new Error(text);
          });
        }
        return res.json();
      })
      .then(data => {
        console.log('Server response:', data);
        // Handle successful authentication (e.g., redirect to dashboard)
      })
      .catch(error => {
        console.error('Error sending credential to server:', error);
      });
  }
}
