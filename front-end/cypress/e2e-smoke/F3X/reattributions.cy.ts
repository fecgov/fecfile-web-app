import { Initialize } from '../pages/loginPage';
import { currentYear, PageUtils } from '../pages/pageUtils';
import { TransactionDetailPage } from '../pages/transactionDetailPage';
import { DataSetup } from './setup';
import { ScheduleFormData } from '../models/TransactionFormModel';
import { Individual } from './utils/start-transaction/receipts';
import { ContactLookup } from '../pages/contactLookup';
import { ReportListPage } from '../pages/reportListPage';
import { buildScheduleA } from '../requests/library/transactions';
import { makeTransaction } from '../requests/methods';

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

function Reattribute(result: any, old = false) {
  cy.intercept('GET', 'http://localhost:8080/api/v1/transactions/**/').as('GetTransaction');
  PageUtils.clickKababItem(' 11(a)(ii) ', 'Reattribute');
  const alias = PageUtils.getAlias('');
  if (old) {
    const selector = cy.get(alias).find('#report-selector');
    selector.select('FORM 3X: JULY 15 QUARTERLY REPORT (Q2)');
    PageUtils.clickButton('Continue');
  }
  cy.wait('@GetTransaction');

  ContactLookup.getContact(result.individual.last_name);
  TransactionDetailPage.enterScheduleFormData(
    new ScheduleFormData(reattributeData),
    false,
    '',
    true,
    'contribution_date',
  );

  PageUtils.clickButton('Save');
  PageUtils.urlCheck('/list');
  cy.contains(Individual.INDIVIDUAL_RECEIPT).should('exist');
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
  //   cy.wait(500);
  //   Reattribute(true);
  // });
});
