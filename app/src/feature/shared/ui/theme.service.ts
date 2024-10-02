import {Injectable, signal, WritableSignal} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  public theme$: WritableSignal<string> = signal(localStorage.getItem('theme') || 'light');
  public isDarkTheme: boolean = this.theme$() === 'dark';

  constructor() {
    this.loadTheme();
  }

  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    this.theme$.set(this.isDarkTheme ? 'dark' : 'light');
    this.applyTheme();
    this.saveTheme();
  }

  loadTheme(): void {
    const savedTheme: string | null = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDarkTheme = savedTheme === 'dark';
      this.applyTheme();
    }
  }

  saveTheme(): void {
    localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
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
