import { environment } from 'environments/environment';
import { ReportTypes } from '../models';

export class FormType {
  code: string;
  label: string;
  description: string;
  createRoute?: string;

  constructor(code: string, label: string, description: string, createRoute?: string) {
    this.code = code;
    this.label = label;
    this.description = description;
    this.createRoute = createRoute;
  }
}

const allFormTypes = new Map<ReportTypes, FormType>([
  [
    ReportTypes.F1M,
    new FormType('F1M', 'Form 1M', 'Notification of Multicandidate Status', '/reports/f1m/create/step1'),
  ],
  [
    ReportTypes.F3,
    new FormType(
      'F3',
      'Form 3',
      'Report of Receipts and Disbursements for an Authorized Committee',
      '/reports/f3/create/step1',
    ),
  ],
  [
    ReportTypes.F3X,
    new FormType('F3X', 'Form 3X', 'Report of Receipts and Disbursements', '/reports/f3x/create/step1'),
  ],
  [ReportTypes.F24, new FormType('F24', 'Form 24', '24/48 Hour Report of Independent Expenditure')],
  [ReportTypes.F99, new FormType('F99', 'Form 99', 'Miscellaneous Report to FEC', '/reports/f99/create')],
]);
export const FORM_TYPES = environment.showForm3
  ? allFormTypes
  : new Map([...allFormTypes.entries()].filter(([formType]) => formType !== ReportTypes.F3));
