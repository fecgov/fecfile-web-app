import { Pipe, PipeTransform } from '@angular/core';
import { StatesCodeMap } from '../utils/label.utils';

@Pipe({ name: 'state' })
export class StatePipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';
    return StatesCodeMap.get(value) ?? '';
  }
}
