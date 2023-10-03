import { LoginPage } from './pages/loginPage';
import { currentYear, PageUtils } from './pages/pageUtils';
import { ReportListPage } from './pages/reportListPage';
import { TransactionDetailPage } from './pages/transactionDetailPage';
import { ContactListPage } from './pages/contactListPage';
import { F3xCreateReportPage } from './pages/f3xCreateReportPage';
import { defaultDebtFormData as debtFormData, defaultLoanFormData, LoanFormData } from './models/TransactionFormModel';
import { defaultFormData as individualContactFormData, ContactFormData } from './models/ContactFormModel';
import { defaultFormData as reportFormData, F3xCreateReportFormData } from './models/ReportFormModel';

export const committeeFormData: ContactFormData = {
  contact_type: 'Committee',
  last_name: PageUtils.randomString(10),
  first_name: PageUtils.randomString(10),
  middle_name: PageUtils.randomString(10),
  prefix: PageUtils.randomString(5),
  suffix: PageUtils.randomString(5),
  country: 'United States of America',
  street_1: PageUtils.randomString(10),
  street_2: PageUtils.randomString(10),
  city: PageUtils.randomString(10),
  state: 'District of Columbia',
  zip: PageUtils.randomString(5),
  phone: PageUtils.randomString(10, 'numeric'),
  employer: PageUtils.randomString(20),
  occupation: PageUtils.randomString(20),
  candidate_id: 'H2AZ12345',
  candidate_office: 'House',
  candidate_state: 'Virginia',
  candidate_district: '01',
  committee_id: 'C' + PageUtils.randomString(8, 'numeric'),
  name: PageUtils.randomString(10),
};

export const organizationFormData: ContactFormData = {
  contact_type: 'Organization',
  last_name: PageUtils.randomString(10),
  first_name: PageUtils.randomString(10),
  middle_name: PageUtils.randomString(10),
  prefix: PageUtils.randomString(5),
  suffix: PageUtils.randomString(5),
  country: 'United States of America',
  street_1: PageUtils.randomString(10),
  street_2: PageUtils.randomString(10),
  city: PageUtils.randomString(10),
  state: 'District of Columbia',
  zip: PageUtils.randomString(5),
  phone: PageUtils.randomString(10, 'numeric'),
  employer: PageUtils.randomString(20),
  occupation: PageUtils.randomString(20),
  candidate_id: 'H2AZ12345',
  candidate_office: 'House',
  candidate_state: 'Virginia',
  candidate_district: '01',
  committee_id: 'C' + PageUtils.randomString(8, 'numeric'),
  name: PageUtils.randomString(10),
};


describe('Debts', () => {
    beforeEach(() => {
        LoginPage.login();
        ReportListPage.deleteAllReports();
        ContactListPage.deleteAllContacts();
        ContactListPage.goToPage();
        ReportListPage.goToPage();
    });
    
    it("should test Debt Owed By Committee loan", () => {
        ContactListPage.goToPage();
        PageUtils.clickButton('New');
        ContactListPage.enterFormData(committeeFormData);
        PageUtils.clickButton('Save');

        ReportListPage.goToPage();
        ReportListPage.clickCreateButton();
        F3xCreateReportPage.enterFormData(reportFormData);
        PageUtils.clickButton('Save and continue');

        PageUtils.clickSidebarItem('Add loans and debts');
        PageUtils.clickLink("DEBTS");
        PageUtils.clickLink("Debt Owed By Committee");

        cy.get('#entity_type_dropdown').type(committeeFormData['contact_type']);

        PageUtils.searchBoxInput(committeeFormData['committee_id']);
        TransactionDetailPage.enterLoanFormData(debtFormData);
        PageUtils.clickButton("Save");
        cy.url().should("contain", "/list");
        cy.contains('Debt Owed By Committee').should('exist');
    }); 

    it("should test Owed To Committee loan", () => {
      // Create a committee contact to be used with contact lookup
      ContactListPage.goToPage();
      PageUtils.clickButton('New');
      ContactListPage.enterFormData(committeeFormData);
      PageUtils.clickButton('Save');

      ReportListPage.goToPage();
      ReportListPage.clickCreateButton();
      F3xCreateReportPage.enterFormData(reportFormData);
      PageUtils.clickButton('Save and continue');

      PageUtils.clickSidebarItem('Add loans and debts');
      PageUtils.clickLink("DEBTS");
      PageUtils.clickLink("Debt Owed To Committee");

      cy.get('#entity_type_dropdown').type(committeeFormData['contact_type']);

      PageUtils.searchBoxInput(committeeFormData['committee_id']);
      TransactionDetailPage.enterLoanFormData(debtFormData);
      PageUtils.clickButton("Save");
      cy.url().should("contain", "/list");
      cy.contains('Debt Owed To Committee').should('exist');
  });
});