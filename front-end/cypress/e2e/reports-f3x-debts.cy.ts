import { LoginPage } from './pages/loginPage';
import { PageUtils } from './pages/pageUtils';
import { ReportListPage } from './pages/reportListPage';
import { TransactionDetailPage } from './pages/transactionDetailPage';
import { ContactListPage } from './pages/contactListPage';
import { F3xCreateReportPage } from './pages/f3xCreateReportPage';
import { defaultDebtFormData as debtFormData } from './models/TransactionFormModel';
import { ContactFormData, defaultFormData as contactFormData } from './models/ContactFormModel';
import { defaultFormData as reportFormData, e2eReportStrings } from './models/ReportFormModel';

const committeeFormData: ContactFormData = {
  ...contactFormData,
  ...{ contact_type: 'Committee' },
};

describe('Debts', () => {
  beforeEach(() => {
    LoginPage.login();
    ReportListPage.deleteAllReports();
    ContactListPage.deleteAllContacts();
    ContactListPage.goToPage();
    ReportListPage.goToPage();
  });

  xit('should test Debt Owed By Committee loan', () => {
    ContactListPage.goToPage();
    PageUtils.clickButton(e2eReportStrings.new);
    ContactListPage.enterFormData(committeeFormData);
    PageUtils.clickButton(e2eReportStrings.save);

    // Create report to add loan too
    ReportListPage.goToPage();
    ReportListPage.clickCreateButton();
    F3xCreateReportPage.enterFormData(reportFormData);
    PageUtils.clickButton(e2eReportStrings.saveAndCont);

    // Navigate to loans
    PageUtils.clickSidebarItem(e2eReportStrings.addLoansAndDebts);
    PageUtils.clickLink(e2eReportStrings.debts);
    PageUtils.clickLink(e2eReportStrings.debtOwedByCommittee);

    cy.get('#entity_type_dropdown').type(committeeFormData.contact_type);

    PageUtils.searchBoxInput(committeeFormData.committee_id);
    TransactionDetailPage.enterLoanFormData(debtFormData);
    PageUtils.clickButton(e2eReportStrings.save);
    PageUtils.urlCheck('/list');
    cy.contains(e2eReportStrings.debtOwedByCommittee).should('exist');
  });

  xit('should test Owed To Committee loan', () => {
    ContactListPage.goToPage();
    PageUtils.clickButton(e2eReportStrings.new);
    ContactListPage.enterFormData(committeeFormData);
    PageUtils.clickButton(e2eReportStrings.save);

    // Create report to add loan too
    ReportListPage.goToPage();
    ReportListPage.clickCreateButton();
    F3xCreateReportPage.enterFormData(reportFormData);
    PageUtils.clickButton(e2eReportStrings.saveAndCont);

    // Navigate to loans
    PageUtils.clickSidebarItem(e2eReportStrings.addLoansAndDebts);
    PageUtils.clickLink(e2eReportStrings.debts);
    PageUtils.clickLink(e2eReportStrings.debtOwedToCommittee);

    cy.get('#entity_type_dropdown').type(committeeFormData['contact_type']);

    PageUtils.searchBoxInput(committeeFormData['committee_id']);
    TransactionDetailPage.enterLoanFormData(debtFormData);
    PageUtils.clickButton(e2eReportStrings.save);
    PageUtils.urlCheck('/list');
    cy.contains(e2eReportStrings.debtOwedToCommittee).should('exist');
  });
});
