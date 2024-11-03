import {Component, inject, OnInit} from '@angular/core';
import {ProfileHeaderAvatarComponent} from "../../component/profile-header-avatar/profile-header-avatar.component";
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {SecurityService} from "@feature-security";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-profile-router',
  standalone: true,
  imports: [
    ProfileHeaderAvatarComponent,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NgClass
  ],
  templateUrl: './profile-router.component.html',
  styleUrl: './profile-router.component.scss'
})
export class ProfileRouterComponent implements OnInit{
  protected securityService: SecurityService = inject(SecurityService);
  protected isSettingsOpen = false;

  ngOnInit() {
  }

  toggleSettings() {
    this.isSettingsOpen = !this.isSettingsOpen;
  }

  logout() {
    this.securityService.logout();
  }

}
