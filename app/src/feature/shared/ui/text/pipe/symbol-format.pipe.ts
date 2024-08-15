import {Pipe, PipeTransform} from "@angular/core";
import {SymbolKey, SYMBOLS_INFO} from "../symbol-key.enum";

@Pipe({
  name: 'symbolFormat',
  standalone: true
})
export class SymbolFormatPipe implements PipeTransform {
  transform(value: string): string {
    const symbolKey: SymbolKey = value.toLowerCase() as SymbolKey;
    const symbolInfo = SYMBOLS_INFO[symbolKey];
    if (symbolInfo) {
      return `${symbolInfo.acronym} ${symbolInfo.name}`;
    }
    return value;
  }
}
