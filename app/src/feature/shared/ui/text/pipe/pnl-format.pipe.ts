import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'pnlFormat'
})
export class PnlFormatPipe implements PipeTransform {
  transform(value: number): string {
    const formattedValue: string = value.toFixed(2);
    return value > 0 ? `+${formattedValue}` : formattedValue;
  }
}
