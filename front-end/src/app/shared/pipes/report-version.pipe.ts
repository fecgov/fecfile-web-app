import { Pipe, PipeTransform } from '@angular/core';
import { LabelUtils } from '../utils/label.utils';
import { F3xFormVersionLabels } from '../models/f3x-summary.model';
import { Report } from '../interfaces/report.interface';

@Pipe({
  name: 'reportVersion',
})
export class ReportVersionPipe implements PipeTransform {
  transform(report?: Report): string {
    const versionParts = [LabelUtils.get(F3xFormVersionLabels, report?.form_type ?? ''), report?.report_version];
    return versionParts.filter((part) => !!part).join(' ');
  }
}
