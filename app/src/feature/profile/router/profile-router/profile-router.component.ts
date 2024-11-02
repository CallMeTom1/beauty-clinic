import {Component, inject, OnInit} from '@angular/core';
import {ProfileHeaderAvatarComponent} from "../../component/profile-header-avatar/profile-header-avatar.component";
import {RouterOutlet} from "@angular/router";
import {SecurityService} from "@feature-security";

@Component({
  selector: 'app-profile-router',
  standalone: true,
  imports: [
    ProfileHeaderAvatarComponent,
    RouterOutlet
  ],
  templateUrl: './profile-router.component.html',
  styleUrl: './profile-router.component.scss'
})
export class ProfileRouterComponent implements OnInit{
  protected securityService: SecurityService = inject(SecurityService);

  ngOnInit() {
    this.securityService.me().subscribe();
  }

}
