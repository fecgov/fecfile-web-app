import { Initialize } from '../pages/loginPage';
import { currentYear, PageUtils } from '../pages/pageUtils';
import { TransactionDetailPage } from '../pages/transactionDetailPage';
import { StartTransaction } from './utils/start-transaction/start-transaction';
import { F3XSetup } from './f3x-setup';
import { ScheduleFormData } from '../models/TransactionFormModel';
import { Individual } from './utils/start-transaction/receipts';
import { faker } from '@faker-js/faker';
import { ContactLookup } from '../pages/contactLookup';

const receiptData: ScheduleFormData = {
  amount: 100.55,
  category_code: '',
  date_received: new Date(currentYear, 4 - 1, 27),
  electionType: undefined,
  electionYear: undefined,
  election_other_description: '',
  purpose_description: faker.lorem.sentence({ min: 1, max: 4 }),
  memo_code: false,
  memo_text: faker.lorem.sentence({ min: 1, max: 4 }),
};

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

function CreateReceipt() {
  return cy.wrap(F3XSetup({ individual: true, candidate: true })).then((result: any) => {
    cy.visit(`/reports/transactions/report/${result.report}/list`);
    StartTransaction.Receipts().Individual().IndividualReceipt();

    ContactLookup.getContact(result.individual.last_name);
    TransactionDetailPage.enterScheduleFormData(
      new ScheduleFormData(receiptData),
      false,
      '',
      true,
      'contribution_date',
    );

    PageUtils.clickButton('Save');
    PageUtils.urlCheck('/list');
    cy.contains(Individual.INDIVIDUAL_RECEIPT).should('exist');

    cy.wrap(result);
  });
}

function Reattribute(result: any, old = false) {
  PageUtils.clickKababItem(' 11(a)(ii) ', 'Reattribute');
  const alias = PageUtils.getAlias('');
  if (old) {
    const selector = cy.get(alias).find('#report-selector');
    selector.select('FORM 3X: JULY 15 QUARTERLY REPORT (Q2)');
    PageUtils.clickButton('Continue');
  }
  cy.wait(500);

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
    CreateReceipt().then((result) => {
      Reattribute(result);
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
