import { Pipe, PipeTransform } from '@angular/core';
import { LabelList, LabelUtils } from '../utils/label.utils';

@Pipe({ name: 'label' })
export class LabelPipe implements PipeTransform {
  transform(value: string | null | undefined, labels: LabelList): string {
    if (value) {
      return LabelUtils.get(labels, value);
    }
    return '';
  }
}
