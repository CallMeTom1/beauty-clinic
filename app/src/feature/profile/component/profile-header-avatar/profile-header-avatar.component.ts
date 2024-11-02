import {Component, effect, inject} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {UserAvatarComponent} from "../../../shared/ui/user-avatar/user-avatar.component";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {lastValueFrom} from "rxjs";
import {SecurityService} from "@feature-security";

@Component({
  selector: 'app-profile-header-avatar',
  standalone: true,
    imports: [
        TranslateModule,
        UserAvatarComponent
    ],
  templateUrl: './profile-header-avatar.component.html',
  styleUrl: './profile-header-avatar.component.scss'
})
export class ProfileHeaderAvatarComponent {

  protected securityService: SecurityService = inject(SecurityService);
  protected showUploadButton: boolean = false;
  protected avatarAlt: string = 'security-feature-avatar-alt';
  protected changeAvatar: string = 'security-feature-change-avatar';
  protected image: string = '';
  protected fistname: string = '';
  protected lastname: string = '';

  triggerFileInput(): void {
    document.getElementById('profileImage')?.click();
  }

  protected profileImageForm: FormGroup = new FormGroup({
    profileImage: new FormControl(null, Validators.required)
  });

  // Gérer le changement d'image de profil
  onProfileImageChange(event: any): void {
    const file: File | undefined = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.profileImageForm.patchValue({
        profileImage: file
      });
      this.uploadProfileImage().then();
    }
  }

  // Upload de l'image de profil
  async uploadProfileImage(): Promise<void> {
    if (this.profileImageForm.valid) {
      const formData: FormData = new FormData();
      const profileImage = this.profileImageForm.get('profileImage')?.value;
      if (profileImage) {
        formData.append('profileImage', profileImage);
        try {
          await lastValueFrom(this.securityService.uploadProfileImage(formData));
          location.reload(); // Rafraîchir pour afficher la nouvelle image
        } catch (error) {
          console.error('Erreur lors de la mise à jour de l\'image de profil', error);
        }
      }
    }
  }

}
