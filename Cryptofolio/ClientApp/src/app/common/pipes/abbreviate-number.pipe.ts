import { Pipe, PipeTransform } from "@angular/core";

@Pipe({name: 'abbreviateNumber'})
export class AbbreviateNumberPipe implements PipeTransform {
  transform(value: number): string {
    if (value < 1000000) {
      return value.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
    } else if (value >= 1000000 && value < 1000000000) {
      const abbreviatedValue = (value / 1000000).toFixed(0);
      return '$' + abbreviatedValue.replace(/\.0+$/, '') + 'M';
    } else {
      const abbreviatedValue = (value / 1000000000).toFixed(0);
      return '$' + abbreviatedValue.replace(/\.0+$/, '') + 'B';
    }
  }
}
