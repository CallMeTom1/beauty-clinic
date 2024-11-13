import {Component, inject, OnInit} from '@angular/core';
import {ProfileHeaderAvatarComponent} from "../../component/profile-header-avatar/profile-header-avatar.component";
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {SecurityService} from "@feature-security";
import {NgClass} from "@angular/common";
import {AppNode, AppRoutes} from "@shared-routes";

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
export class ProfileRouterComponent implements OnInit {
  protected securityService: SecurityService = inject(SecurityService);
  protected isSettingsOpen = false;

  // Ajouter la vérification pour les routes de paramètres
  protected isSettingsRoute(): boolean {
    const currentUrl = window.location.pathname;
    return currentUrl.includes(AppRoutes.MY_INFO) ||
      currentUrl.includes(AppRoutes.MY_ADDRESS_BOOK);
  }

  ngOnInit() {
    // Initialiser isSettingsOpen en fonction de la route actuelle
    this.isSettingsOpen = this.isSettingsRoute();
  }

  toggleSettings() {
    this.isSettingsOpen = !this.isSettingsOpen;
  }

  logout() {
    this.securityService.logout();
  }

  protected readonly AppRoutes = AppRoutes;
  protected readonly AppNode = AppNode;
}
