import { LoginPage } from './pages/loginPage';
import { PageUtils } from './pages/pageUtils';
import { ReportListPage } from './pages/reportListPage';
import { TransactionDetailPage } from './pages/transactionDetailPage';
import { ContactListPage } from './pages/contactListPage';
import { F3xCreateReportPage } from './pages/f3xCreateReportPage';
import { defaultDebtFormData as debtFormData} from './models/TransactionFormModel';
import { ContactFormData } from './models/ContactFormModel';
import { defaultFormData as reportFormData, loanEnums } from './models/ReportFormModel';

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
    PageUtils.clickButton(loanEnums.new);
    ContactListPage.enterFormData(committeeFormData);
    PageUtils.clickButton(loanEnums.save);

    // Create report to add loan too
    ReportListPage.goToPage();
    ReportListPage.clickCreateButton();
    F3xCreateReportPage.enterFormData(reportFormData);
    PageUtils.clickButton(loanEnums.saveAndCont);

    // Navigate to loans
    PageUtils.clickSidebarItem(loanEnums.addLoansAndDebts);
    PageUtils.clickLink(loanEnums.debts);
    PageUtils.clickLink(loanEnums.debtOwedByCommittee);

    cy.get('#entity_type_dropdown').type(committeeFormData.contact_type);

    PageUtils.searchBoxInput(committeeFormData.committee_id);
    TransactionDetailPage.enterLoanFormData(debtFormData);
    PageUtils.clickButton(loanEnums.save);
    PageUtils.urlCheck("/list");
    cy.contains(loanEnums.debtOwedByCommittee).should('exist');
  });

  it("should test Owed To Committee loan", () => {
    ContactListPage.goToPage();
    PageUtils.clickButton(loanEnums.new);
    ContactListPage.enterFormData(committeeFormData);
    PageUtils.clickButton(loanEnums.save);

    // Create report to add loan too
    ReportListPage.goToPage();
    ReportListPage.clickCreateButton();
    F3xCreateReportPage.enterFormData(reportFormData);
    PageUtils.clickButton(loanEnums.saveAndCont);

    // Navigate to loans
    PageUtils.clickSidebarItem(loanEnums.addLoansAndDebts);
    PageUtils.clickLink(loanEnums.debts);
    PageUtils.clickLink(loanEnums.debtOwedToCommittee);


    cy.get('#entity_type_dropdown').type(committeeFormData['contact_type']);

    PageUtils.searchBoxInput(committeeFormData['committee_id']);
    TransactionDetailPage.enterLoanFormData(debtFormData);
    PageUtils.clickButton(loanEnums.save);
    PageUtils.urlCheck("/list");
    cy.contains(loanEnums.debtOwedToCommittee).should('exist');
  });
});