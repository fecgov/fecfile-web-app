import { Initialize } from '../pages/loginPage';
import { currentYear, PageUtils } from '../pages/pageUtils';
import { TransactionDetailPage } from '../pages/transactionDetailPage';
import { f3ReportId$, F3XSetup } from './f3x-setup';
import {
  ContributionFormData,
  defaultScheduleFormData as defaultTransactionFormData,
} from '../models/TransactionFormModel';
import { Contributions } from './utils/start-transaction/disbursements';
import { F3X_Q1, F3X_Q2 } from '../requests/library/reports';
import { Candidate_House_A$, Committee_A$ } from '../requests/library/contacts';
import { combineLatest, filter, first } from 'rxjs';
import { buildContributionToCandidate } from '../requests/library/transactions';
import { makeRequestToAPI } from '../requests/methods';

const redesignationData: ContributionFormData = {
  ...defaultTransactionFormData,
  ...{
    electionType: 'P',
    purpose_description: undefined,
    category_code: undefined,
  },
};

function Redesignate(old = false) {
  PageUtils.clickKababItem(Contributions.TO_CANDIDATE, 'Redesignate');
  const alias = PageUtils.getAlias('');
  if (old) {
    const selector = cy.get(alias).find('#report-selector');
    selector.select('FORM 3X: JULY 15 QUARTERLY REPORT (Q2)');
    PageUtils.clickButton('Continue');
  }
  cy.wait(500);

  TransactionDetailPage.enterScheduleFormDataForContribution(
    new ContributionFormData(redesignationData),
    false,
    '',
    'expenditure_date',
  );

  PageUtils.clickButton('Save');
  PageUtils.urlCheck('/list');
  cy.contains(Contributions.TO_CANDIDATE).should('exist');
}

describe('Redesignations', () => {
  beforeEach(() => {
    Initialize();
  });

  it('should test redesignating a Schedule E contribution in the current report', () => {
    makeRequestToAPI(
      'POST',
      'http://localhost:8080/api/v1/reports/form-3x/?fields_to_validate=filing_frequency',
      F3X_Q2,
    );
    F3XSetup({ committee: true, candidate: true, report: F3X_Q1 });
    combineLatest([
      Committee_A$.pipe(filter((value) => value !== undefined)),
      Candidate_House_A$.pipe(filter((value) => value !== undefined)),
      f3ReportId$.pipe(filter((value) => value !== '')),
    ])
      .pipe(first())
      .subscribe(([committeeA, candidateA, reportId]) => {
        const transaction = buildContributionToCandidate(
          100.55,
          `${currentYear}-03-27`,
          [committeeA, candidateA],
          reportId,
          { election_code: 'P2020', support_oppose_code: 'S', date_signed: `${currentYear}-07-09` },
        );
        makeRequestToAPI('POST', 'http://localhost:8080/api/v1/transactions/', transaction);
        cy.visit(`/reports/transactions/report/${reportId}/list`);
        Redesignate();
      });
  });
});
