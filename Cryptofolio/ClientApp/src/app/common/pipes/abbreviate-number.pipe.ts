import { Pipe, PipeTransform } from "@angular/core";

@Pipe({name: 'abbreviateNumber'})
export class AbbreviateNumberPipe implements PipeTransform {
  transform(value: number): string {
    const numericValue = Number(value);
    if (isNaN(numericValue)) {
      return '';
    }
    if (numericValue < 1000000) {
      const abbreviatedValue = numericValue.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 });
      return '$' + abbreviatedValue;
    } else if (numericValue >= 1000000 && numericValue < 1000000000) {
      const abbreviatedValue = (numericValue / 1000000).toLocaleString(undefined, { maximumFractionDigits: 0, minimumFractionDigits: 0 });
      return '$' + abbreviatedValue.replace(/\.0+$/, '') + ' M';
    } else {
      const abbreviatedValue = (numericValue / 1000000000).toLocaleString(undefined, { maximumFractionDigits: 0, minimumFractionDigits: 0 });
      return '$' + abbreviatedValue.replace(/\.0+$/, '') + ' B';
    }
  }
}
