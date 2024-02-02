import { Transform, Type } from 'class-transformer';
import { BaseModel } from './base.model';
import { UploadSubmission } from './upload-submission.model';
import { WebPrintSubmission } from './webprint-submission.model';
import { JsonSchema } from '../interfaces/json-schema.interface';
import { F3xReportCodes } from '../utils/report-code.utils';

export abstract class Report extends BaseModel {
  id: string | undefined;
  abstract schema: JsonSchema;
  abstract report_type: ReportTypes;
  abstract form_type: string;
  hasChangeOfAddress = false;
  submitAlertText =
    'Are you sure you want to submit this form electronically? Please note that you cannot undo this action. Any changes needed will need to be filed as an amended report.';
  report_version: string | undefined; // Tracks amendment versions
  report_id: string | undefined; // FEC assigned report ID
  confirmation_email_1: string | undefined;
  confirmation_email_2: string | undefined;
  is_first: boolean | undefined;
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

  abstract get formLabel(): string;

  abstract get formSubLabel(): string;

  abstract get versionLabel(): string;

  get reportCode(): F3xReportCodes | undefined {
    return;
  }

  get coverageDates(): { [date: string]: Date | undefined } | undefined {
    return;
  }

  get canAmend() {
    return false;
  }

  get reportLabel(): string {
    if (!this.reportCode) return '';
    switch (this.reportCode) {
      case F3xReportCodes.Q1:
        return 'APRIL 15 (Q1)';
      case F3xReportCodes.Q2:
        return 'JULY 15 (Q2)';
      case F3xReportCodes.Q3:
        return 'OCTOBER 15 (Q3)';
      case F3xReportCodes.YE:
        return 'JANUARY 31 (YE)';
      case F3xReportCodes.TER:
        return 'TERMINATION (TER)';
      case F3xReportCodes.MY:
        return 'JULY 31 (MY)';
      case F3xReportCodes.TwelveG:
        return 'GENERAL (12G)';
      case F3xReportCodes.TwelveP:
        return 'PRIMARY (12P)';
      case F3xReportCodes.TwelveR:
        return 'RUNOFF (12R)';
      case F3xReportCodes.TwelveS:
        return 'SPECIAL (12S)';
      case F3xReportCodes.TwelveC:
        return 'CONVENTION (12C)';
      case F3xReportCodes.ThirtyG:
        return 'GENERAL (30G)';
      case F3xReportCodes.ThirtyR:
        return 'RUNOFF (30R)';
      case F3xReportCodes.ThirtyS:
        return 'SPECIAL (30S)';
      case F3xReportCodes.M2:
        return 'FEBRUARY 20 (M2)';
      case F3xReportCodes.M3:
        return 'MARCH 30 (M3)';
      case F3xReportCodes.M4:
        return 'APRIL 20 (M4)';
      case F3xReportCodes.M5:
        return 'MAY 20 (M5)';
      case F3xReportCodes.M6:
        return 'JUNE 20 (M6)';
      case F3xReportCodes.M7:
        return 'JULY 20 (M7)';
      case F3xReportCodes.M8:
        return 'AUGUST 20 (M8)';
      case F3xReportCodes.M9:
        return 'SEPTEMBER 20 (M9)';
      case F3xReportCodes.M10:
        return 'OCTOBER 20 (M10)';
      case F3xReportCodes.M11:
        return 'NOVEMBER 20 (M11)';
      case F3xReportCodes.M12:
        return 'DECEMBER 20 (M12)';
    }
  }

  getBlocker(): string | undefined {
    return;
  }
}

export enum ReportTypes {
  F3X = 'F3X',
  F24 = 'F24',
  F99 = 'F99',
  F1M = 'F1M',
}

export enum ReportStatus {
  IN_PROGRESS = 'In progress',
  SUBMIT_SUCCESS = 'Submission success',
}
