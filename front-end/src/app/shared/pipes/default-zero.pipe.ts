import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'defaultZero' })
export class DefaultZeroPipe implements PipeTransform {
  transform(value: number | undefined): number {
    if (value === undefined) {
      return 0;
    }
    return value;
  }
}
