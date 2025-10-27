import { plainToInstance, Transform } from 'class-transformer';
import { schema as f99Schema } from 'fecfile-validate/fecfile_validate_js/dist/F99';
import { BaseModel } from './base.model';
import { Report, ReportTypes } from './report.model';

export enum F99FormTypes {
  F99 = 'F99',
}

export type F99FormType = F99FormTypes.F99;

export class Form99 extends Report {
  schema = f99Schema;
  report_type = ReportTypes.F99;
  form_type = F99FormTypes.F99;
  override submitAlertText =
    'Are you sure you want to submit this form electronically? Please note that you cannot undo this action.';

  get formLabel() {
    return 'Form 99';
  }

  get formSubLabel() {
    return textCodes.find(({ value }) => value === this.text_code)?.label ?? 'Miscellaneous Report to the FEC';
  }

  treasurer_last_name: string | undefined;
  treasurer_first_name: string | undefined;
  treasurer_middle_name: string | undefined;
  treasurer_prefix: string | undefined;
  treasurer_suffix: string | undefined;
  @Transform(BaseModel.dateTransform) date_signed: Date | undefined;
  text_code: string | undefined;
  message_text: string | undefined;
  filing_frequency: string | undefined;

  static fromJSON(json: unknown): Form99 {
    return plainToInstance(Form99, json);
  }
}

const allTextCodes = Object.entries({
  MST: 'Miscellaneous Report to the FEC',
  MSM: 'Filing Frequency Change Notice',
  MSW: 'Loan Agreement / Loan Forgiveness',
  MSI: 'Disavowal Response',
  MSR: 'Form 3L Filing Frequency Change Notice',
});

export const textCodes = allTextCodes.map(([code, label]) => ({
  value: code,
  label,
}));

export enum textCodesWithFilingFrequencies {
  MSR,
  MSM,
}
export const filingFrequencies = [
  {
    label: 'Quarterly',
    value: 'Q',
  },
  {
    label: 'Monthly',
    value: 'M',
  },
];
