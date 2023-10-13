import { Transform, Type } from 'class-transformer';
import { BaseModel } from './base.model';
import { UploadSubmission } from './upload-submission.model';
import { WebPrintSubmission } from './webprint-submission.model';
import { ReportF3X, F3xFormTypes } from './report-f3x.model';
import { ReportF24, F24FormTypes } from './report-f24.model';
import { ReportF99, F99FormTypes } from './report-f99.model';

export abstract class Report extends BaseModel {
  id: string | undefined;
  report_type: ReportTypes = ReportTypes.F3X;
  form_type: FormTypes = F3xFormTypes.F3XN;
  report_version: string | undefined; // Tracks amendment versions
  report_id: string | undefined; // FEC assigned report ID

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

export type Reports = ReportF3X | ReportF24 | ReportF99;
export type FormTypes = F3xFormTypes | F24FormTypes | F99FormTypes;

export enum ReportTypes {
  F3X = 'F3X',
  F24 = 'F24',
  F99 = 'F99',
}
