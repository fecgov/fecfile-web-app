import { Initialize } from '../pages/loginPage';
import { PageUtils } from '../pages/pageUtils';
import { ReportListPage } from '../pages/reportListPage';
import { TransactionDetailPage } from '../pages/transactionDetailPage';
import { candidateFormData, committeeFormData } from '../models/ContactFormModel';
import { StartTransaction } from './start-transaction/start-transaction';
import { F3XSetup, reportFormDataApril, reportFormDataJuly } from './f3x-setup';
import {
  ContributionFormData,
  defaultScheduleFormData as defaultTransactionFormData,
} from '../models/TransactionFormModel';
import { Contributions } from './start-transaction/disbursements';

const APRIL_15 = 'APRIL 15';

const contributionData: ContributionFormData = {
  ...defaultTransactionFormData,
  ...{
    candidate: candidateFormData.candidate_id,
  },
};

const redesignationData: ContributionFormData = {
  ...defaultTransactionFormData,
  ...{
    electionType: 'P',
    purpose_description: undefined,
    category_code: undefined,
  },
};

function CreateContribution() {
  F3XSetup({ committee: true, candidate: true, report: reportFormDataApril });

  StartTransaction.Disbursements().Contributions().ToCandidate();

  cy.get('[role="searchbox"]').type(committeeFormData.name.slice(0, 1));
  cy.contains(committeeFormData.name).should('exist');
  cy.contains(committeeFormData.name).click();

  TransactionDetailPage.enterScheduleFormDataForContribution(contributionData);

  PageUtils.clickButton('Save');
  PageUtils.urlCheck('/list');
  cy.contains(Contributions.TO_CANDIDATE).should('exist');
}

function Redesignate(old = false) {
  PageUtils.getKabob(Contributions.TO_CANDIDATE).contains('Redesignate').first().click({ force: true });
  const alias = PageUtils.getAlias('');
  if (old) {
    const selector = cy.get(alias).find('#report-selector');
    selector.select('FORM 3X: JULY 15 QUARTERLY REPORT (Q2)');
    PageUtils.clickButton('Continue');
  }
  cy.wait(500);

  TransactionDetailPage.enterScheduleFormDataForContribution(new ContributionFormData(redesignationData));

  PageUtils.clickButton('Save');
  PageUtils.urlCheck('/list');
  cy.contains(Contributions.TO_CANDIDATE).should('exist');
}

describe('Redesignations', () => {
  beforeEach(() => {
    Initialize();
  });

  it('should test redesignating a Schedule E contribution in the current report', () => {
    // Create an individual contact to be used as reattributor to
    CreateContribution();
    Redesignate();
  });

  it('should test redesignating a Schedule E contribution from a submitted report', () => {
    // Create an individual contact to be used with contact lookup
    CreateContribution();
    ReportListPage.createF3X(reportFormDataJuly);
    ReportListPage.submitReport(APRIL_15);
    ReportListPage.editReport(APRIL_15, 'Review report');
    PageUtils.clickSidebarSection('REVIEW TRANSACTIONS');
    cy.wait(500);
    Redesignate(true);
  });
});
