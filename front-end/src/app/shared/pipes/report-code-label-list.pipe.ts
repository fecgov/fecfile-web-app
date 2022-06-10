import { Pipe, PipeTransform } from '@angular/core';
import { ReportCodeLabelList, ReportCodeLabel } from '../utils/reportCodeLabels.utils';

@Pipe({ name: 'findOnReportCodePipe' })
export class FindOnReportCodePipe implements PipeTransform {
  transform(list: ReportCodeLabelList | null, reportCode: string) {
    let label: ReportCodeLabel = { label: '', report_code: '' };
    let found: ReportCodeLabel | undefined = undefined;
    if (list != null) {
      if (list.length > 0) {
        found = list.find((item) => item.report_code == reportCode);
        if (found != undefined) label = found;
      }
    }
    return label;
  }
}
