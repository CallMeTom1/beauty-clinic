import { Component } from '@angular/core';

@Component({
  selector: 'app-clinic-nav',
  standalone: true,
  imports: [],
  templateUrl: './clinic-nav.component.html',
  styleUrl: './clinic-nav.component.scss'
})
export class ClinicNavComponent {
  isDropdownOpen = false;

  onMouseEnter(): void {
    this.isDropdownOpen = true;
  }

  onMouseLeave(): void {
    this.isDropdownOpen = false;
  }
}
