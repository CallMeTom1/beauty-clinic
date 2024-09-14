import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-overlay-grid',
  standalone: true,
  imports: [],
  templateUrl: './overlay.component.html',
  styleUrl: './overlay.component.scss'
})
export class OverlayComponent {
  @Input() numberOfColumns: number = 12; // Par défaut, 12 colonnes
  get columns(): Array<number> {
    return Array(this.numberOfColumns);
  }
}
