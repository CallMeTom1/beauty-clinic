import {Component, inject} from '@angular/core';
import {CareService} from "../../care.service";

@Component({
  selector: 'app-care-list-care-card',
  standalone: true,
  imports: [],
  templateUrl: './care-list-care-card.component.html',
  styleUrl: './care-list-care-card.component.scss'
})
export class CareListCareCardComponent {
  protected careService: CareService = inject(CareService);

  protected readonly describe = describe;
}
