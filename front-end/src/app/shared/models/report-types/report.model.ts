import { Transform, Type } from 'class-transformer';
import { F3xReportCodes } from '../../utils/report-code.utils';
import { BaseModel } from '../base.model';
import { UploadSubmission } from '../upload-submission.model';
import { WebPrintSubmission } from '../webprint-submission.model';
import { F24FormType } from './f24-report.model';
import { F3xFormType } from './f3x-report.model';

export type FormType = F24FormType | F3xFormType;

export abstract class Report extends BaseModel {
  id?: string;
  form_type?: FormType;

  report_status?: string;
  report_code?: F3xReportCodes;
  @Transform(BaseModel.dateTransform) coverage_from_date?: Date;
  @Transform(BaseModel.dateTransform) coverage_through_date?: Date;

  committee_name?: string;

  street_1?: string;
  street_2?: string;
  city?: string;
  state?: string;
  zip?: string;

  treasurer_last_name?: string;
  treasurer_first_name?: string;
  treasurer_middle_name?: string;
  treasurer_prefix?: string;
  treasurer_suffix?: string;

  @Type(() => UploadSubmission)
  @Transform(UploadSubmission.transform)
  upload_submission?: UploadSubmission;
  @Type(() => WebPrintSubmission)
  @Transform(WebPrintSubmission.transform)
  webprint_submission?: WebPrintSubmission;
  calculation_status?: string;

  @Type(() => Date)
  @Transform(BaseModel.dateTransform)
  created?: Date;
  @Type(() => Date)
  @Transform(BaseModel.dateTransform)
  updated?: Date;
  deleted?: string;
}
