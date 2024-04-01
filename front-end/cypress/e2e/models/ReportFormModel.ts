import { currentYear } from '../pages/pageUtils';

export class F3xCreateReportFormData {
  filing_frequency: string;
  report_type_category: string;
  report_code: string;
  coverage_from_date: Date;
  coverage_through_date: Date;
  date_of_election: Date;
  state_of_election: string;

  constructor(formData: F3xCreateReportFormData) {
    this.filing_frequency = formData.filing_frequency;
    this.report_type_category = formData.report_type_category;
    this.report_code = formData.report_code;
    this.coverage_through_date = formData.coverage_through_date;
    this.coverage_from_date = formData.coverage_from_date;
    this.date_of_election = formData.date_of_election;
    this.state_of_election = formData.state_of_election;
  }
}

export class F24CreateReportFormData {
  report_type_24_48: '24' | '48' | undefined;

  constructor(formData: F24CreateReportFormData) {
    this.report_type_24_48 = formData.report_type_24_48;
  }
}

export const defaultForm3XData: F3xCreateReportFormData = {
  filing_frequency: 'Q', // Q, M
  report_type_category: 'Election Year',
  report_code: '12G',
  coverage_from_date: new Date(currentYear, 4 - 1, 1),
  coverage_through_date: new Date(currentYear, 4 - 1, 30),
  date_of_election: new Date(currentYear, 11 - 1, 4),
  state_of_election: 'California',
};

export const defaultForm24Data: F24CreateReportFormData = {
  report_type_24_48: '24',
};
