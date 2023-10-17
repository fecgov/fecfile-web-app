import { plainToClass, Transform } from 'class-transformer';
import { Report } from './report.model';
import { LabelList } from '../utils/label.utils';
import { BaseModel } from './base.model';

export enum F99FormTypes {
  F99 = 'F99',
}

export type F99FormType = F99FormTypes.F99;

export const F99FormTypeLabels: LabelList = [[F99FormTypes.F99, 'FORM 99']];

export const F3xFormVersionLabels: LabelList = [[F99FormTypes.F99, 'Original']];

export class Form99 extends Report {
  override form_type = F99FormTypes.F99;

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

  // prettier-ignore
  static fromJSON(json: any): Form99 { // eslint-disable-line @typescript-eslint/no-explicit-any
    return plainToClass(Form99, json);
  }
}
