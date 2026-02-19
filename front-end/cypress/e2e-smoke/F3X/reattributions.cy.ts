import { Initialize } from '../pages/loginPage';
import { currentYear } from '../pages/pageUtils';
import { TransactionDetailPage } from '../pages/transactionDetailPage';
import { DataSetup } from './setup';
import { ScheduleFormData } from '../models/TransactionFormModel';
import { Individual } from './utils/start-transaction/receipts';
import { ContactLookup } from '../pages/contactLookup';
import { ReportListPage } from '../pages/reportListPage';
import { buildScheduleA } from '../requests/library/transactions';
import { makeTransaction } from '../requests/methods';
import { ApiUtils } from '../utils/api';
import { runTransactionMutation } from './utils/transaction-mutations';
import { SmokeAliases } from '../utils/aliases';

const reattributeData: ScheduleFormData = {
  amount: 100.55,
  category_code: '',
  date_received: new Date(currentYear, 4 - 1, 27),
  electionType: undefined,
  electionYear: undefined,
  election_other_description: '',
  purpose_description: undefined,
  memo_code: false,
  memo_text: '',
};
const REATTRIBUTIONS_ALIAS_SOURCE = 'reattributionsSpec';

function Reattribute(result: any, old = false) {
  cy.intercept({
    method: 'GET',
    pathname: new RegExp(`^${ApiUtils.apiRoutePathname('/transactions/')}[^/]+/$`),
  }).as(SmokeAliases.network.named('GetTransaction', REATTRIBUTIONS_ALIAS_SOURCE));
  runTransactionMutation(
    {
      transactionLabel: '11(a)(ii)',
      actionLabel: 'Reattribute',
      successLabel: Individual.INDIVIDUAL_RECEIPT,
      oldReportLabel: old ? 'FORM 3X: JULY 15 QUARTERLY REPORT (Q2)' : undefined,
      readySelector: '',
    },
    () => {
      cy.wait(`@${SmokeAliases.network.named('GetTransaction', REATTRIBUTIONS_ALIAS_SOURCE)}`);
      ContactLookup.getContact(result.individual.last_name);
      TransactionDetailPage.enterScheduleFormData(
        new ScheduleFormData(reattributeData),
        false,
        '',
        true,
        'contribution_date',
      );
    },
  );
}

describe('Reattributions', () => {
  beforeEach(() => {
    Initialize();
  });

  it('should test reattributing a Schedule A in the current report', () => {
    DataSetup({ individual: true, candidate: true }).then((result: any) => {
      const receipt = buildScheduleA('INDIVIDUAL_RECEIPT', 100.55, '2025-04-12', result.individual, result.report);
      makeTransaction(receipt, () => {
        ReportListPage.goToReportList(result.report);
        Reattribute(result);
      });
    });
  });
  // Test disabled until a mock is set up for submitting a report.
  // xit('should test reattributing a Schedule A in a submitted report', () => {
  //   // Create an individual contact to be used with contact lookup
  //   ContactListPage.createIndividual(assignee);
  //   CreateReceipt();
  //   ReportListPage.createF3X(reportFormDataJuly);
  //   ReportListPage.submitReport(APRIL_15);
  //   ReportListPage.editReport(APRIL_15, 'Review');
  //   PageUtils.clickSidebarSection('REVIEW TRANSACTIONS');
  //   Reattribute(true);
  // });
});
