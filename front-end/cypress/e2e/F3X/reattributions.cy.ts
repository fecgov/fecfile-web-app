import { ContactListPage } from '../pages/contactListPage';
import { Initialize } from '../pages/loginPage';
import { currentYear, PageUtils } from '../pages/pageUtils';
import { ReportListPage } from '../pages/reportListPage';
import { TransactionDetailPage } from '../pages/transactionDetailPage';
import {
  ContactFormData,
  ContactType,
  createContact,
  defaultFormData as individualContactFormData,
} from '../models/ContactFormModel';
import { StartTransaction } from './utils/start-transaction/start-transaction';
import { F3XSetup, reportFormDataApril, reportFormDataJuly } from './f3x-setup';
import { ScheduleFormData } from '../models/TransactionFormModel';
import { Individual } from './utils/start-transaction/receipts';
import { faker } from '@faker-js/faker';

const APRIL_15 = 'APRIL 15';

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

const assignee: ContactFormData = createContact(ContactType.INDIVIDUAL);

function CreateReceipt() {
  F3XSetup({ individual: true, candidate: true, report: reportFormDataApril });
  StartTransaction.Receipts().Individual().IndividualReceipt();

  cy.get('[id="searchBox"]').type(individualContactFormData.last_name.slice(0, 1));
  cy.contains(individualContactFormData.last_name).should('exist');
  cy.contains(individualContactFormData.last_name).click();
  TransactionDetailPage.enterScheduleFormData(new ScheduleFormData(receiptData), false, '', true, 'contribution_date');

  PageUtils.clickButton('Save');
  PageUtils.urlCheck('/list');
  cy.contains(Individual.INDIVIDUAL_RECEIPT).should('exist');
}

function Reattribute(old = false) {
  PageUtils.clickKababItem(' 11(a)(ii) ', 'Reattribute');
  const alias = PageUtils.getAlias('');
  if (old) {
    const selector = cy.get(alias).find('#report-selector');
    selector.select('FORM 3X: JULY 15 QUARTERLY REPORT (Q2)');
    PageUtils.clickButton('Continue');
  }
  cy.wait(500);

  cy.get('[id="searchBox"]').type(assignee.last_name.slice(0, 1));
  cy.contains(assignee.last_name).should('exist');
  cy.contains(assignee.last_name).click();
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
    // Create an individual contact to be used as reattributor to
    ContactListPage.createIndividual(assignee);
    CreateReceipt();
    Reattribute();
  });

  // Test disabled until a mock is set up for submitting a report.
  xit('should test reattributing a Schedule A in a submitted report', () => {
    // Create an individual contact to be used with contact lookup
    ContactListPage.createIndividual(assignee);
    CreateReceipt();
    ReportListPage.createF3X(reportFormDataJuly);
    ReportListPage.submitReport(APRIL_15);
    ReportListPage.editReport(APRIL_15, 'Review');
    PageUtils.clickSidebarSection('REVIEW TRANSACTIONS');
    cy.wait(500);
    Reattribute(true);
  });
});
