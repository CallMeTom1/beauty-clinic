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


}
