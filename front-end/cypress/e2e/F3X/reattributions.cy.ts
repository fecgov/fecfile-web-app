import { ContactListPage } from '../pages/contactListPage';
import { LoginPage } from '../pages/loginPage';
import { currentYear, PageUtils } from '../pages/pageUtils';
import { ReportListPage } from '../pages/reportListPage';
import { TransactionDetailPage } from '../pages/transactionDetailPage';
import {
  ContactFormData,
  createIndividual,
  defaultFormData as individualContactFormData
} from '../models/ContactFormModel';
import { StartTransaction } from "./start-transaction/start-transaction";
import { F3XSetup, reportFormDataApril, reportFormDataJuly } from "./f3x-setup";
import { ScheduleFormData } from "../models/TransactionFormModel";

const APRIL_15 = 'APRIL 15';

const receiptData: ScheduleFormData = {
  amount: 100.55,
  category_code: '',
  date_received: new Date(currentYear, 4 - 1, 27),
  electionType: undefined,
  electionYear: undefined,
  election_other_description: '',
  purpose_description: PageUtils.randomString(20),
  memo_code: false,
  memo_text: PageUtils.randomString(20),
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
}

const assignee: ContactFormData = createIndividual();

function CreateReceipt() {
  F3XSetup({individual: true, candidate: true, report: reportFormDataApril});
  StartTransaction.Receipts().Individual().IndividualReceipt();

  cy.get('[role="searchbox"]').type(individualContactFormData.last_name.slice(0, 1));
  cy.contains(individualContactFormData.last_name).should('exist');
  cy.contains(individualContactFormData.last_name).click();
  TransactionDetailPage.enterScheduleFormData(new ScheduleFormData(receiptData));


  PageUtils.clickButton('Save');
  PageUtils.urlCheck('/list');
  cy.contains('Individual Receipt').should('exist');
}

function Reattribute(old = false) {
  PageUtils.getKabob(' 11(a)(ii) ').contains('Reattribute').first().click({force: true});
  const alias = PageUtils.getAlias('');
  if (old) {
    const selector = cy.get(alias).find('#report-selector');
    selector.select('FORM 3X: JULY 15 QUARTERLY REPORT (Q2)');
    PageUtils.clickButton('Continue');
  }
  cy.wait(500);

  cy.get('[role="searchbox"]').type(assignee.last_name.slice(0, 1));
  cy.contains(assignee.last_name).should('exist');
  cy.contains(assignee.last_name).click();
  TransactionDetailPage.enterScheduleFormData(new ScheduleFormData(reattributeData));

  PageUtils.clickButton('Save');
  PageUtils.urlCheck('/list');
  cy.contains('Individual Receipt').should('exist');
}


describe('Reattributions', () => {
  beforeEach(() => {
    LoginPage.login();
    ReportListPage.deleteAllReports();
    ContactListPage.deleteAllContacts();
    ContactListPage.goToPage();
    ReportListPage.goToPage();
  });

  it('should test reattributing a Schedule A in the current report', () => {
    // Create an individual contact to be used as reattributor to
    ContactListPage.createIndividual(assignee);
    CreateReceipt();
    Reattribute();
  });

  it('should test reattributing a Schedule A in a submitted report', () => {
    // Create an individual contact to be used with contact lookup
    ContactListPage.createIndividual(assignee);
    CreateReceipt();
    ReportListPage.createF3X(reportFormDataJuly);
    ReportListPage.submitReport(APRIL_15);
    ReportListPage.editReport(APRIL_15, 'Review report');
    PageUtils.clickSidebarSection('REVIEW TRANSACTIONS');
    cy.wait(500);
    Reattribute(true);
  });

});
