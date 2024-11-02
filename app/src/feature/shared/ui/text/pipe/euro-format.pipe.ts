import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customEuro',
  standalone: true
})
export class CustomEuroPipe implements PipeTransform {
  transform(value: number | string, decimals: number = 2): string {
    if (value == null) return '';

    // Convertir en nombre si c'est une chaîne
    let numValue = typeof value === 'string' ? parseFloat(value) : value;

    // Vérifier si c'est un nombre valide
    if (isNaN(numValue)) return '';

    // Formater le nombre
    const formattedNumber = numValue.toFixed(decimals);

    // Séparer la partie entière et décimale
    const [integerPart, decimalPart] = formattedNumber.split('.');

    // Formatter la partie entière avec des espaces comme séparateurs de milliers
    const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

    // Reconstruire le nombre formaté avec le signe euro à côté du prix
    const result = `${formattedIntegerPart},${decimalPart}€`;

    return result;
  }
}
