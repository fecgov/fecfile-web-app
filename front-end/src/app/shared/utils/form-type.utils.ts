import { environment } from 'environments/environment';

export enum FormTypes {
  F1M = 'F1M',
  F3 = 'F3',
  F3X = 'F3X',
  F24 = 'F24',
  F99 = 'F99',
}

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

const allFormTypes = new Map<FormTypes, FormType>([
  [FormTypes.F1M, new FormType('F1M', 'Form 1M', 'Notification of Multicandidate Status', '/reports/f1m/create/step1')],
  [
    FormTypes.F3,
    new FormType(
      'F3',
      'Form 3',
      'Report of Receipts and Disbursements for an Authorized Committee',
      '/reports/f3/create/step1',
    ),
  ],
  [FormTypes.F3X, new FormType('F3X', 'Form 3X', 'Report of Receipts and Disbursements', '/reports/f3x/create/step1')],
  [FormTypes.F24, new FormType('F24', 'Form 24', '24/48 Hour Report of Independent Expenditure')],
  [FormTypes.F99, new FormType('F99', 'Form 99', 'Miscellaneous Report to FEC', '/reports/f99/create')],
]);
export const FORM_TYPES = environment.showForm3
  ? allFormTypes
  : new Map([...allFormTypes.entries()].filter(([formType]) => formType !== FormTypes.F3));
