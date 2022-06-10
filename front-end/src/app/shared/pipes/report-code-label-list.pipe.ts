import { Pipe, PipeTransform } from '@angular/core';
import { ReportCodeLabelList, ReportCodeLabel } from '../utils/reportCodeLabels.utils';

@Pipe({ name: 'findOnReportCodePipe' })
export class FindOnReportCodePipe implements PipeTransform {
  transform(list: ReportCodeLabelList | null, reportCode: string): ReportCodeLabel | undefined {
    let label: ReportCodeLabel | undefined = undefined;

    if (list != undefined && list?.length > 0) {
      label = list.find((item) => item.report_code == reportCode);
    }
    return label;
  }
}
