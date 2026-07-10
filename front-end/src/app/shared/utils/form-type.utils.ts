import { ReportTypes } from '../models';

export class FormType {
  code: string;
  label: string;
  description: string;

  constructor(code: string, label: string, description: string) {
    this.code = code;
    this.label = label;
    this.description = description;
  }
}

const allFormTypes = new Map<ReportTypes, FormType>([
  [ReportTypes.F1M, new FormType('F1M', 'Form 1M', 'Notification of Multicandidate Status')],
  [ReportTypes.F3, new FormType('F3', 'Form 3', 'Report of Receipts and Disbursements for an Authorized Committee')],
  [ReportTypes.F3X, new FormType('F3X', 'Form 3X', 'Report of Receipts and Disbursements')],
  [ReportTypes.F24, new FormType('F24', 'Form 24', '24/48 Hour Report of Independent Expenditure')],
  [ReportTypes.F99, new FormType('F99', 'Form 99', 'Miscellaneous Report to FEC')],
]);

export function getFormTypes(showForm3: boolean): Map<ReportTypes, FormType> {
  return showForm3
    ? allFormTypes
    : new Map([...allFormTypes.entries()].filter(([formType]) => formType !== ReportTypes.F3));
}
