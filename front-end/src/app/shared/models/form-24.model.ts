import { plainToInstance, Transform } from 'class-transformer';
import { schema as f24Schema } from 'fecfile-validate/fecfile_validate_js/dist/F24';
import { BaseModel } from './base.model';
import { Report, ReportStatus, ReportTypes } from './report.model';

export enum F24FormTypes {
  F24N = 'F24N',
  F24A = 'F24A',
}

export type F24FormType = F24FormTypes.F24N | F24FormTypes.F24A;

export class Form24 extends Report {
  schema = f24Schema;
  report_type = ReportTypes.F24;
  form_type = F24FormTypes.F24N;
  name?: string;

  get formLabel() {
    return 'Form 24';
  }

  get formSubLabel() {
    return this.name ?? '';
  }

  override get canAmend(): boolean {
    return this.report_status === ReportStatus.SUBMIT_SUCCESS;
  }

  report_type_24_48: '24' | '48' | undefined;
  @Transform(BaseModel.dateTransform) original_amendment_date: Date | undefined;
  treasurer_last_name: string | undefined;
  treasurer_first_name: string | undefined;
  treasurer_middle_name: string | undefined;
  treasurer_prefix: string | undefined;
  treasurer_suffix: string | undefined;
  @Transform(BaseModel.dateTransform) date_signed: Date | undefined;

  static fromJSON(json: unknown): Form24 {
    return plainToInstance(Form24, json);
  }
}
