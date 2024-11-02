import { Component, effect, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SecurityService } from '@feature-security';
import { lastValueFrom } from 'rxjs';
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { UserAvatarComponent } from "../../../shared/ui/user-avatar/user-avatar.component";
import { FormcontrolSimpleConfig } from "@shared-ui";
import { FloatingLabelInputTestComponent } from "../../../shared/ui/form/component/floating-label-input-test/floating-label-input-test.component";
import { ModifyProfilePayload } from "../../../security/data/payload/user/modify-profile.payload";
import { User } from '../../../security/data/model/user';
import {ModifyPasswordPayload} from "../../../security/data/payload/user/modify-password.payload";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [TranslateModule, UserAvatarComponent, ReactiveFormsModule, FloatingLabelInputTestComponent, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {


}
