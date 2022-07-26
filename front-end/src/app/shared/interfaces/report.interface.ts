import { F3xReportCode } from '../models/f3x-summary.model';

export interface Report {
  id: number | null;
  form_type: string;
  filer_committee_id_number: string | null;
  report_code: F3xReportCode | null;
  coverage_from_date: Date | null;
  coverage_through_date: Date | null;
}
