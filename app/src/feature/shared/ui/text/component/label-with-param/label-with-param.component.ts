import {Component, Input} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-label-with-param',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './label-with-param.component.html',
  styleUrl: './label-with-param.component.scss'
})
export class LabelWithParamComponent {
  @Input({required: true}) label!: string;
  @Input() params?: any;

}
