import { ContactListPage } from '../pages/contactListPage';
import { LoginPage } from '../pages/loginPage';
import { currentYear, PageUtils } from '../pages/pageUtils';
import { ReportListPage } from '../pages/reportListPage';
import { TransactionDetailPage } from '../pages/transactionDetailPage';
import { defaultFormData as individualContactFormData } from '../models/ContactFormModel';
import { ReceiptFormData, } from '../models/TransactionFormModel';
import { StartTransaction } from "./start-transaction/start-transaction";
import { F3XSetup, reportFormDataApril } from "./f3x-setup";

const receiptData: ReceiptFormData = {
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

function CreateReceipt() {
  F3XSetup({individual: true, candidate: true, report: reportFormDataApril});
  StartTransaction.Receipts().Individual().IndividualReceipt();

  cy.get('[role="searchbox"]').type(individualContactFormData.last_name.slice(0, 1));
  cy.contains(individualContactFormData.last_name).should('exist');
  cy.contains(individualContactFormData.last_name).click();

  TransactionDetailPage.enterScheduleFormData(new ReceiptFormData(receiptData));

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
    // Create an individual contact to be used with contact lookup
    CreateReceipt();

  });


});
