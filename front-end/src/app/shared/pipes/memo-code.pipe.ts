import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'memoCode' })
export class MemoCodePipe implements PipeTransform {
  transform(value: boolean) {
    return value ? 'Y' : '-';
  }
}
