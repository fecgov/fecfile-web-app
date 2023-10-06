import { Transform, Type } from 'class-transformer';
import { BaseModel } from './base.model';
import { UploadSubmission } from './upload-submission.model';
import { WebPrintSubmission } from './webprint-submission.model';
import { FormTypes } from '../utils/form-type.utils';
import { ReportF3X } from './report-f3x.model';

export abstract class Report extends BaseModel {
  id: string | undefined;
  form_type: FormTypes | undefined;

  @Type(() => UploadSubmission)
  @Transform(UploadSubmission.transform)
  upload_submission: UploadSubmission | undefined;
  report_status: string | undefined;
  @Type(() => WebPrintSubmission)
  @Transform(WebPrintSubmission.transform)
  webprint_submission: WebPrintSubmission | undefined;

  @Type(() => Date)
  @Transform(BaseModel.dateTransform)
  created: Date | undefined;
  @Type(() => Date)
  @Transform(BaseModel.dateTransform)
  updated: Date | undefined;
  deleted: string | undefined;
}

export type ReportTypes = ReportF3X;
