export enum FormTypes {
  F3X = 'F3X',
  F24 = 'F24',
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
  //   [
  //     FormTypes.F24,
  //     new FormType('F24', 'Form 24', '24/48 Hour Notice of Independent Expentiture', '/reports/f24/create/step1'),
  //   ],
]);
