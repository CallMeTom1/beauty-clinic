import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dollar',
  standalone: true
})
export class DollarFormatPipe implements PipeTransform {
  transform(value: string, minFractionDigits: number = 2, maxFractionDigits: number = 2): string {
    const numberValue: number = parseFloat(value);

    if (!isNaN(numberValue)) {
      const options: Intl.NumberFormatOptions = {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: minFractionDigits,
        maximumFractionDigits: maxFractionDigits
      };

      return new Intl.NumberFormat('en-US', options).format(numberValue);
    } else {
      return '$0.00';
    }
  }
}
