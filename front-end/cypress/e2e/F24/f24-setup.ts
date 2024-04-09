import { defaultForm24Data as defaultReportFormData, F24CreateReportFormData } from '../models/ReportFormModel';
import { ContactListPage } from '../pages/contactListPage';
import { ReportListPage } from '../pages/reportListPage';

export interface Setup {
  organization?: boolean;
  individual?: boolean;
  candidate?: boolean;
  committee?: boolean;
  report?: F24CreateReportFormData;
}

export function F24Setup(setup: Setup = {}) {
  if (setup.individual) ContactListPage.createIndividual();
  if (setup.organization) ContactListPage.createOrganization();
  if (setup.candidate) ContactListPage.createCandidate();
  if (setup.committee) ContactListPage.createCommittee();
  ReportListPage.createF24(setup.report ?? defaultReportFormData);
}
