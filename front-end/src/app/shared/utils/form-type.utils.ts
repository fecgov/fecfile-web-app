export enum FormTypes {
  F3X,
  F24,
}

export class FormType {
  code: string;
  label: string;
  description: string;
  createRoute: string;

  constructor(code: string, label: string, description: string, createRoute: string) {
    this.code = code;
    this.label = label;
    this.description = description;
    this.createRoute = createRoute;
  }
}

export const FORM_TYPES = new Map<FormTypes, FormType>([
  [FormTypes.F3X, new FormType('F3X', 'Form 3X', 'Report of Receipts and Disbursements', '/reports/f3x/create/step1')],
]);
