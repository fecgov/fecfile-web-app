import { Pipe, PipeTransform } from '@angular/core';
import { LabelUtils } from '../utils/label.utils';
import { F3xFormVersionLabels } from '../models/report-f3x.model';
import { Report } from '../models/report.model';

@Pipe({
  name: 'reportVersion',
})
export class ReportVersionPipe implements PipeTransform {
  transform(report?: Report): string {
    const versionParts = [LabelUtils.get(F3xFormVersionLabels, report?.form_type ?? ''), report?.report_version];
    return versionParts.filter((part) => !!part).join(' ');
  }
}
