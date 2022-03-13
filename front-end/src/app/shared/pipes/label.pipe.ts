import { Pipe, PipeTransform } from '@angular/core';
import { LabelUtils } from '../utils/label.utils';

@Pipe({
  name: 'label',
})
export class LabelPipe implements PipeTransform {
  transform(value: string | null | undefined, labels: string[][]): string {
    if (!!value) {
      return LabelUtils.get(labels, value);
    }
    return '';
  }
}
