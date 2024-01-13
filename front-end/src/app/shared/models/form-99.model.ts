import { plainToClass, Transform } from 'class-transformer';
import { Report, ReportTypes } from './report.model';
import { BaseModel } from './base.model';
import { schema as f99Schema } from 'fecfile-validate/fecfile_validate_js/dist/F99';

export enum F99FormTypes {
  F99 = 'F99',
}

export type F99FormType = F99FormTypes.F99;

export const F99FormVersionLabels: { [key in F99FormTypes]: string } = {
  [F99FormTypes.F99]: 'Original',
};

export class Form99 extends Report {
  schema = f99Schema;
  report_type = ReportTypes.F99;
  form_type = F99FormTypes.F99;
  override submitAlertText =
    'Are you sure you want to submit this form electronically? Please note that you cannot undo this action.';

  get formLabel() {
    return 'FORM 99';
  }

  get formSubLabel() {
    return textCodes.find(({ value }) => value === this.text_code)?.label ?? '';
  }

  get versionLabel() {
    return `${F99FormVersionLabels[this.form_type]} ${this.report_version ?? ''}`.trim();
  }

  committee_name: string | undefined;
  street_1: string | undefined;
  street_2: string | undefined;
  city: string | undefined;
  state: string | undefined;
  zip: string | undefined;
  treasurer_last_name: string | undefined;
  treasurer_first_name: string | undefined;
  treasurer_middle_name: string | undefined;
  treasurer_prefix: string | undefined;
  treasurer_suffix: string | undefined;
  @Transform(BaseModel.dateTransform) date_signed: Date | undefined;
  text_code: string | undefined;
  message_text: string | undefined;

  // prettier-ignore
  static fromJSON(json: any): Form99 { // eslint-disable-line @typescript-eslint/no-explicit-any
    return plainToClass(Form99, json);
  }
}

export const textCodes = [
  {
    label: 'Disavowal Response',
    value: 'MSI',
  },
  {
    label: 'Filing Frequency Change Notice',
    value: 'MSM',
  },
  {
    label: 'Miscellaneous Report to the FEC',
    value: 'MST',
  },
];
