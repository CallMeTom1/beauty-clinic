import {Component, inject, OnInit} from '@angular/core';
import {ThemeService} from "./theme-toggler.service";
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

  public isDarkTheme: boolean = false;

  ngOnInit(): void {
    this.themeService.theme$.set('light');
    document.body.classList.add('light');
    this.loadTheme();
  }

  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    if (this.isDarkTheme) {
      this.themeService.theme$.set('dark');
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    } else {
      this.themeService.theme$.set('light');
      document.body.classList.add('light');
      document.body.classList.remove('dark');
    }
    this.saveTheme();
  }

  loadTheme(): void {
    const savedTheme: string | null = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDarkTheme = savedTheme === 'dark';
      this.applyTheme();
    }
  }

  saveTheme():void {
    localStorage.setItem(environment.LOCAL_STORAGE_THEME, this.isDarkTheme ? 'dark' : 'light');
  }

  applyTheme(): void {
    if (this.isDarkTheme) {
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    } else {
      document.body.classList.add('light');
      document.body.classList.remove('dark');
    }
  }
}
