import { plainToClass, Transform } from 'class-transformer';
import { Report } from './report.model';
import { LabelList } from '../utils/label.utils';
import { BaseModel } from './base.model';

export enum F24FormTypes {
  F24N = 'F24N',
  F24A = 'F24A',
}

export type F24FormType = F24FormTypes.F24N | F24FormTypes.F24A;

export const F24FormTypeLabels: LabelList = [
  [F24FormTypes.F24N, 'FORM 24'],
  [F24FormTypes.F24A, 'FORM 24'],
];

export const F3xFormVersionLabels: LabelList = [
  [F24FormTypes.F24N, 'Original'],
  [F24FormTypes.F24A, 'Amendment'],
];

export class ReportF24 extends Report {
  override form_type = F24FormTypes.F24A;

  report_type_24_48: string | undefined;
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
  static fromJSON(json: any): ReportF24 { // eslint-disable-line @typescript-eslint/no-explicit-any
    return plainToClass(ReportF24, json);
  }
}
