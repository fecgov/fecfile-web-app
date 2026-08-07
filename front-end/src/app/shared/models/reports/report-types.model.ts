import type { LabelList } from 'app/shared/utils/label.utils';

export const ReportTypes = {
  F3: 'F3',
  F3X: 'F3X',
  F24: 'F24',
  F99: 'F99',
  F1M: 'F1M',
} as const;
export type ReportTypes = (typeof ReportTypes)[keyof typeof ReportTypes];
export function isForm3Group(reportType: ReportTypes) {
  return reportType === ReportTypes.F3 || reportType === ReportTypes.F3X;
}

export const reportLabelList: LabelList = [
  [ReportTypes.F3, 'Form 3'],
  [ReportTypes.F3X, 'Form 3X'],
  [ReportTypes.F24, 'Form 24'],
  [ReportTypes.F99, 'Form 99'],
  [ReportTypes.F1M, 'Form 1M'],
];
