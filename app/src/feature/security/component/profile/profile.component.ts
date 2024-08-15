import { Component, inject } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { SecurityService } from '@feature-security';
import {lastValueFrom} from 'rxjs';
import { RoleTransformPipe } from '@shared-ui';
import {TranslateModule} from "@ngx-translate/core";
import {UserAvatarComponent} from "../../../shared/ui/user-avatar/user-avatar.component";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, RoleTransformPipe, ReactiveFormsModule, TranslateModule, UserAvatarComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent  {

  protected securityService: SecurityService = inject(SecurityService);

  protected width: string = '150px';
  protected form: FormGroup;
  protected formRetry: FormGroup;
  protected profileImageForm: FormGroup;
  protected showUploadButton: boolean = false;
  protected fileNameFront: string = 'security-feature-no-file-chose';
  protected fileNameBack: string = 'security-feature-no-file-chose';
  protected fileNameFrontRetry: string = 'security-feature-no-file-chose';
  protected fileNameBackRetry: string = 'security-feature-no-file-chose';
  protected profileTitle: string = 'security-feature-profile-title';
  protected avatarAlt: string = 'security-feature-avatar-alt';
  protected changeAvatar: string = 'security-feature-change-avatar';
  protected personalInfoTitle: string = 'security-feature-personal-info-title';
  protected fullNameLabel: string = 'security-feature-full-name';
  protected phoneLabel: string ='security-feature-phone';
  protected roleLabel: string ='security-feature-role';
  protected identityVerificationTitle: string = 'security-feature-identity-verification-title';
  protected verifyIdentity: string = 'security-feature-verify-identity';
  protected idCardFront: string = 'security-feature-id-card-front';
  protected idCardBack: string = 'security-feature-id-card-back';
  protected submitBtn: string = 'security-feature-submit-btn';
  protected verificationPending: string = 'security-feature-verification-pending';
  protected verificationRejected: string = 'security-feature-verification-rejected';
  protected identityVerified: string = 'security-feature-identity-verified';

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      idCardFront: [null, Validators.required],
      idCardBack: [null, Validators.required],
    });
    this.formRetry = this.fb.group({
      idCardFrontRetry: [null, Validators.required],
      idCardBackRetry: [null, Validators.required],
    });

    this.profileImageForm = this.fb.group({
      profileImage: [null, Validators.required]
    });
  }

  onProfileImageChange(event: any): void {
    const file: File | undefined = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.profileImageForm.patchValue({
        profileImage: file
      });
      this.uploadProfileImage().then();
    }
  }

  async uploadProfileImage(): Promise<void> {
    if (this.profileImageForm.valid) {
      const formData: FormData = new FormData();
      const profileImage = this.profileImageForm.get('profileImage')?.value;
      if (profileImage) {
        formData.append('profileImage', profileImage);
        try {
          await lastValueFrom(this.securityService.uploadProfileImage(formData));
          location.reload();
        } catch (error) {
        }
      }
    }
  }



  hasSubscriptionRole(): boolean {
    const role: string = this.securityService.account$().role;
    return role === 'USER_VERIFIED' || role === 'SUBSCRIBER_TIER_1' || role === 'SUBSCRIBER_TIER_2' || role === 'SUBSCRIBER_TIER_3';
  }

}
