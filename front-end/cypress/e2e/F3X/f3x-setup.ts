import { defaultForm3XData as reportFormData, F3xCreateReportFormData } from '../models/ReportFormModel';
import { currentYear } from '../pages/pageUtils';
import { Candidate_House_A, Committee_A, Individual_A_A, Organization_A } from '../requests/library/contacts';
import { makeRequestToAPI } from '../requests/methods';
import { F3X_Q2 } from '../requests/library/reports';

export interface Setup {
  organization?: boolean;
  individual?: boolean;
  candidate?: boolean;
  committee?: boolean;
  report?: F3xCreateReportFormData;
}

export function F3XSetup(setup: Setup = {}) {
  if (setup.individual) makeRequestToAPI('POST', 'http://localhost:8080/api/v1/contacts/', Individual_A_A);
  if (setup.organization) makeRequestToAPI('POST', 'http://localhost:8080/api/v1/contacts/', Organization_A);
  if (setup.candidate) makeRequestToAPI('POST', 'http://localhost:8080/api/v1/contacts/', Candidate_House_A);
  if (setup.committee) makeRequestToAPI('POST', 'http://localhost:8080/api/v1/contacts/', Committee_A);
  // ReportListPage.createF3X(setup.report ?? defaultReportFormData);
  makeRequestToAPI('POST', 'http://localhost:8080/api/v1/reports/form-3x/?fields_to_validate=filing_frequency', F3X_Q2);
}

export const reportFormDataApril: F3xCreateReportFormData = {
  ...reportFormData,
  ...{
    report_code: 'Q1',
    coverage_from_date: new Date(currentYear, 0, 1),
    coverage_through_date: new Date(currentYear, 3, 30),
  },
};

export const reportFormDataJuly: F3xCreateReportFormData = {
  ...reportFormData,
  ...{
    report_code: 'Q2',
    coverage_from_date: new Date(currentYear, 4, 1),
    coverage_through_date: new Date(currentYear, 7, 30),
  },
};
