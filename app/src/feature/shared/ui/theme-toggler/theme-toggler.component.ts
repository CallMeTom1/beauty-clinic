import {Component, inject, OnInit} from '@angular/core';
import {ThemeService} from "../theme.service";
import {environment} from "@env";

@Component({
  selector: 'app-theme-toggler',
  standalone: true,
  imports: [],
  templateUrl: './theme-toggler.component.html',
  styleUrl: './theme-toggler.component.scss'
})
export class ThemeTogglerComponent implements OnInit {

  protected themeService: ThemeService = inject(ThemeService);

  ngOnInit(): void {
    this.themeService.loadTheme();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  get isDarkTheme(): boolean {
    return this.themeService.isDarkTheme;
  }
}
