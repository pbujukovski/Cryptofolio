import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'abbreviateOrNumber'
})
export class AbbreviateOrNumberPipe implements PipeTransform {
  transform(value: number, dirty: boolean): any {
    if (dirty) {
      return value;
    } else {
      const suffixes = ['', 'K', 'M', 'B', 'T'];
      const num = Math.abs(value);
      const tier = Math.log10(num) / 3 | 0;
      if (tier === 0) {
        return value;
      }
      const suffix = suffixes[tier];
      const scale = Math.pow(10, tier * 3);
      const scaled = value / scale;
      return scaled.toFixed(1) + suffix;
    }
  }
}
