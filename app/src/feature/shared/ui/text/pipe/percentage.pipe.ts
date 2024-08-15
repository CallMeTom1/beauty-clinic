import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'percentage'
})
export class PercentagePipe implements PipeTransform {
  transform(value: number): string {
    return `${value.toFixed(2)}%`;
  }
}
