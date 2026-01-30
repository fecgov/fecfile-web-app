import { plainToClass, Transform } from 'class-transformer';
import { BaseModel } from '../base.model';
import { Report, ReportStatus } from './report.model';
import { ReportCodes } from 'app/shared/utils/report-code.utils';

export class CoverageDates {
  @Transform(BaseModel.dateTransform) coverage_from_date: Date | undefined;
  @Transform(BaseModel.dateTransform) coverage_through_date: Date | undefined;
  report_code: ReportCodes | undefined;
  report_code_label?: string;

  // prettier-ignore
  static fromJSON(json: any, reportCodeLabel: string): CoverageDates { // eslint-disable-line @typescript-eslint/no-explicit-any
    json.report_code_label = reportCodeLabel;
    return plainToClass(CoverageDates, json);
  }
}

export abstract class BaseForm3 extends Report {
  calculation_status: string | undefined;
  override hasChangeOfAddress = true;
  change_of_address: boolean | undefined;
  election_code: string | undefined;
  @Transform(BaseModel.dateTransform) date_of_election: Date | undefined;
  state_of_election: string | undefined;
  @Transform(BaseModel.dateTransform) coverage_from_date: Date | undefined;
  @Transform(BaseModel.dateTransform) coverage_through_date: Date | undefined;
  qualified_committee: boolean | undefined;
  treasurer_last_name: string | undefined;
  treasurer_first_name: string | undefined;
  treasurer_middle_name: string | undefined;
  treasurer_prefix: string | undefined;
  treasurer_suffix: string | undefined;
  @Transform(BaseModel.dateTransform) date_signed: Date | undefined;

  get coverageDates(): { [date: string]: Date | undefined } {
    return { coverage_from_date: this.coverage_from_date, coverage_through_date: this.coverage_through_date };
  }

  override get canAmend(): boolean {
    return this.report_status === ReportStatus.SUBMIT_SUCCESS;
  }
}
