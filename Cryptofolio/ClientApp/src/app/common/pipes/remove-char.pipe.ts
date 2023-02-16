import { Pipe, PipeTransform } from "@angular/core";

@Pipe({name: 'removeChar'})
export class RemoveChar implements PipeTransform {
  transform(value: string): string {
    return value.replace(/\s*\[\+\d+\s*chars\]/, '');
  }
}
