import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'timestampFormat'
})

export class TimestampFormatPipe implements PipeTransform {
  transform(value: number): string {
    if (!value) return '';

    let timeString: string = new Date(value).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    let microsecondPart: string = (value % 1000).toString().padStart(3, '0');

    return `${timeString}.${microsecondPart}`;
  }
}
