import { plainToClass, Transform } from 'class-transformer';
import { Report, ReportTypes } from './report.model';
import { BaseModel } from './base.model';

export enum F24FormTypes {
  F24N = 'F24N',
  F24A = 'F24A',
}

export type F24FormType = F24FormTypes.F24N | F24FormTypes.F24A;

export const F24FormVersionLabels: { [key in F24FormTypes]: string } = {
  [F24FormTypes.F24N]: 'Original',
  [F24FormTypes.F24A]: 'Amendment',
};
export class Form24 extends Report {
  override report_type = ReportTypes.F24;
  override form_type = F24FormTypes.F24A;
  get formLabel() {
    return 'FORM 24';
  }
  get versionLabel() {
    return F24FormVersionLabels[this.form_type] ?? '';
  }
  override get routePrintPreviewBack() {
    return '/reports';
  }
  override get routePrintPreviewSignAndSubmit() {
    return '/reports';
  }

  report_type_24_48: '24' | '48' | undefined;
  @Transform(BaseModel.dateTransform) original_amendment_date: Date | undefined;
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

  // prettier-ignore
  static fromJSON(json: any): Form24 { // eslint-disable-line @typescript-eslint/no-explicit-any
    return plainToClass(Form24, json);
  }
}
