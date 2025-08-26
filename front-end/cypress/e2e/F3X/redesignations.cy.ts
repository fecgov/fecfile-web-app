import { Initialize } from '../pages/loginPage';
import { currentYear, PageUtils } from '../pages/pageUtils';
import { TransactionDetailPage } from '../pages/transactionDetailPage';
import { F3XSetup } from './f3x-setup';
import {
  ContributionFormData,
  defaultScheduleFormData as defaultTransactionFormData,
} from '../models/TransactionFormModel';
import { Contributions } from './utils/start-transaction/disbursements';
import { F3X_Q1, F3X_Q2 } from '../requests/library/reports';
import { buildContributionToCandidate } from '../requests/library/transactions';
import { makeF3x, makeTransaction } from '../requests/methods';

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

  it('should test redesignating a Schedule E contribution in the current report', async () => {
    cy.wrap(F3XSetup({ committee: true, candidate: true, reports: [F3X_Q1, F3X_Q2] })).then((result: any) => {
      const transaction = buildContributionToCandidate(
        100.55,
        `${currentYear}-03-27`,
        [result.committee, result.candidate],
        result.report,
        { election_code: 'P2020', support_oppose_code: 'S', date_signed: `${currentYear}-07-09` },
      );
      makeTransaction(transaction);
      cy.visit(`/reports/transactions/report/${result.report}/list`);
      Redesignate();
    });
  });
});
