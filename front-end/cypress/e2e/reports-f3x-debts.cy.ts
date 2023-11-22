import { LoginPage } from './pages/loginPage';
import { PageUtils } from './pages/pageUtils';
import { ReportListPage } from './pages/reportListPage';
import { TransactionDetailPage } from './pages/transactionDetailPage';
import { ContactListPage } from './pages/contactListPage';
import { F3xCreateReportPage } from './pages/f3xCreateReportPage';
import { defaultDebtFormData as debtFormData } from './models/TransactionFormModel';
import { ContactFormData, defaultFormData as contactFormData } from './models/ContactFormModel';
import { defaultFormData as reportFormData } from './models/ReportFormModel';

const committeeFormData: ContactFormData = {
  ...contactFormData,
  ...{ contact_type: 'Committee' },
};

xdescribe('Debts', () => {
  beforeEach(() => {
    LoginPage.login();
    ReportListPage.deleteAllReports();
    ContactListPage.deleteAllContacts();
    ContactListPage.goToPage();
    ReportListPage.goToPage();
  });

  it('should test Debt Owed By Committee loan', () => {
    ContactListPage.goToPage();
    PageUtils.clickButton('New');
    ContactListPage.enterFormData(committeeFormData);
    PageUtils.clickButton('Save');

    // Create report to add loan too
    ReportListPage.goToPage();
    ReportListPage.clickCreateButton();
    F3xCreateReportPage.enterFormData(reportFormData);
    PageUtils.clickButton('Save and continue');

    // Navigate to loans
    PageUtils.clickSidebarItem('Add loans and debts');
    PageUtils.clickLink('DEBTS');
    PageUtils.clickLink('Debt Owed By Committee');

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
    ContactListPage.goToPage();
    PageUtils.clickButton('New');
    ContactListPage.enterFormData(committeeFormData);
    PageUtils.clickButton('Save');

    // Create report to add loan too
    ReportListPage.goToPage();
    ReportListPage.clickCreateButton();
    F3xCreateReportPage.enterFormData(reportFormData);
    PageUtils.clickButton('Save and continue');

    // Navigate to loans
    PageUtils.clickSidebarItem('Add loans and debts');
    PageUtils.clickLink('DEBTS');
    PageUtils.clickLink('Debt Owed To Committee');

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
