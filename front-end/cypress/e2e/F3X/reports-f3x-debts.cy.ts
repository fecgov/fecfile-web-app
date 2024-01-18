import { LoginPage } from '../pages/loginPage';
import { PageUtils } from '../pages/pageUtils';
import { ReportListPage } from '../pages/reportListPage';
import { TransactionDetailPage } from '../pages/transactionDetailPage';
import { ContactListPage } from '../pages/contactListPage';
import { defaultDebtFormData as debtFormData } from '../models/TransactionFormModel';
import { committeeFormData } from '../models/ContactFormModel';
import { F3XSetup } from "./f3x-setup";
import { StartTransaction } from "./start-transaction/start-transaction";


describe('Debts', () => {
  beforeEach(() => {
    LoginPage.login();
    ReportListPage.deleteAllReports();
    ContactListPage.deleteAllContacts();
    ContactListPage.goToPage();
    ReportListPage.goToPage();
  });

  it('should test Debt Owed By Committee loan', () => {
    F3XSetup({committee: true});
    StartTransaction.Debts().ByCommittee();

    PageUtils.urlCheck('DEBT_OWED_BY_COMMITTEE');
    PageUtils.containedOnPage('Debt Owed By Committee');
    cy.get('#entity_type_dropdown').type(committeeFormData.contact_type);

    PageUtils.searchBoxInput(committeeFormData.committee_id);
    TransactionDetailPage.enterLoanFormData(debtFormData);
    PageUtils.clickButton('Save');
    PageUtils.urlCheck('/list');
    cy.contains('Debt Owed By Committee').should('exist');
  });

  it('should test Owed To Committee loan', () => {
    F3XSetup({committee: true});
    StartTransaction.Debts().ToCommittee();

    PageUtils.urlCheck('DEBT_OWED_TO_COMMITTEE');
    PageUtils.containedOnPage('Debt Owed To Committee');
    cy.get('#entity_type_dropdown').type(committeeFormData['contact_type']);

    PageUtils.searchBoxInput(committeeFormData['committee_id']);
    TransactionDetailPage.enterLoanFormData(debtFormData);
    PageUtils.clickButton('Save');
    PageUtils.urlCheck('/list');
    cy.contains('Debt Owed To Committee').should('exist');
  });
});
