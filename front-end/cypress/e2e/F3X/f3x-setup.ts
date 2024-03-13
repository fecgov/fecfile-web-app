import {
  defaultFormData as reportFormData,
  defaultFormData as defaultReportFormData,
  F3xCreateReportFormData,
} from '../models/ReportFormModel';
import { ContactListPage } from '../pages/contactListPage';
import { ReportListPage } from '../pages/reportListPage';
import { currentYear } from '../pages/pageUtils';

export interface Setup {
  organization?: boolean;
  individual?: boolean;
  candidate?: boolean;
  committee?: boolean;
  report?: F3xCreateReportFormData;
}

export function F3XSetup(setup: Setup = {}) {
  if (setup.individual) ContactListPage.createIndividual();
  if (setup.organization) ContactListPage.createOrganization();
  if (setup.candidate) ContactListPage.createCandidate();
  if (setup.committee) ContactListPage.createCommittee();
  ReportListPage.createF3X(setup.report ?? defaultReportFormData);
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
