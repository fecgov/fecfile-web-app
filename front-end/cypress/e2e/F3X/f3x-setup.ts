import { defaultForm3XData as reportFormData, F3xCreateReportFormData } from '../models/ReportFormModel';
import { currentYear } from '../pages/pageUtils';
import {
  Candidate_House_A,
  Candidate_House_A$,
  Committee_A,
  Committee_A$,
  Individual_A_A,
  Individual_A_A$,
  Organization_A,
  Organization_A$,
} from '../requests/library/contacts';
import { makeRequestToAPI } from '../requests/methods';
import { F3X_Q2 } from '../requests/library/reports';
import { BehaviorSubject } from 'rxjs';
import { ContactListPage } from '../pages/contactListPage';
import { ReportListPage } from '../pages/reportListPage';

export interface Setup {
  organization?: boolean;
  individual?: boolean;
  candidate?: boolean;
  committee?: boolean;
  report?: F3xCreateReportFormData;
}

export const f3ReportId$ = new BehaviorSubject('');

export function NewF3XSetup(setup: Setup = {}) {
  if (setup.individual)
    makeRequestToAPI('POST', 'http://localhost:8080/api/v1/contacts/', Individual_A_A, (response) => {
      Individual_A_A$.next(response.body);
    });
  if (setup.organization)
    makeRequestToAPI('POST', 'http://localhost:8080/api/v1/contacts/', Organization_A, (response) => {
      Organization_A$.next(response.body);
    });
  if (setup.candidate)
    makeRequestToAPI('POST', 'http://localhost:8080/api/v1/contacts/', Candidate_House_A, (response) => {
      Candidate_House_A$.next(response.body);
    });
  if (setup.committee)
    makeRequestToAPI('POST', 'http://localhost:8080/api/v1/contacts/', Committee_A, (response) => {
      Committee_A$.next(response.body);
    });
  makeRequestToAPI(
    'POST',
    'http://localhost:8080/api/v1/reports/form-3x/?fields_to_validate=filing_frequency',
    F3X_Q2,
    (response) => {
      f3ReportId$.next(response.body.id);
    },
  );
}

export function F3XSetup(setup: Setup = {}) {
  if (setup.individual) ContactListPage.createIndividual();
  if (setup.organization) ContactListPage.createOrganization();
  if (setup.candidate) ContactListPage.createCandidate();
  if (setup.committee) ContactListPage.createCommittee();
  ReportListPage.createF3X(setup.report ?? reportFormData);
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
