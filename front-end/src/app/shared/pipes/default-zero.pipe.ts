import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'defaultZero',
})
export class DefaultZeroPipe implements PipeTransform {
  transform(value: number | null): number {
    if (value === null) {
      return 0;
    }
    return value;
  }
}
