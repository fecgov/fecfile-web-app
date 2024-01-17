import { ContactListPage } from '../pages/contactListPage';
import { F3xCreateReportPage } from '../pages/f3xCreateReportPage';
import { LoginPage } from '../pages/loginPage';
import { currentYear, PageUtils } from '../pages/pageUtils';
import { ReportListPage } from '../pages/reportListPage';
import { TransactionDetailPage } from '../pages/transactionDetailPage';
import { ContactFormData, defaultFormData as individualContactFormData } from '../models/ContactFormModel';
import { defaultFormData as defaultReportFormData } from '../models/ReportFormModel';
import {
  defaultScheduleFormData as defaultTransactionFormData,
  DisbursementFormData,
} from '../models/TransactionFormModel';

const organizationFormData: ContactFormData = {
  ...individualContactFormData,
  ...{contact_type: 'Organization'},
};

const candidateFormData: ContactFormData = {
  ...individualContactFormData,
  ...{contact_type: 'Candidate'},
};

const independantExpVoidData: DisbursementFormData = {
  ...defaultTransactionFormData,
  ...{
    date2: new Date(currentYear, 4 - 1, 27),
    supportOpposeCode: 'SUPPORT',
    signatoryDateSigned: new Date(currentYear, 4 - 1, 27),
    signatoryFirstName: PageUtils.randomString(10),
    signatoryLastName: PageUtils.randomString(10),
  },
};

describe('Disbursements', () => {
  beforeEach(() => {
    LoginPage.login();
    ReportListPage.deleteAllReports();
    ContactListPage.deleteAllContacts();
    ContactListPage.goToPage();
    ReportListPage.goToPage();
  });

  it('should test F3xFederalElectionActivityExpendituresPage disbursement', () => {
    // Create an individual contact to be used with contact lookup
    ContactListPage.goToPage();
    PageUtils.clickButton('New');
    ContactListPage.enterFormData(individualContactFormData);
    PageUtils.clickButton('Save');

    ReportListPage.goToPage();
    ReportListPage.clickCreateButton();
    F3xCreateReportPage.enterFormData(defaultReportFormData);
    PageUtils.clickButton('Save and continue');

    PageUtils.clickSidebarItem('Add a disbursement');
    PageUtils.clickLink('FEDERAL ELECTION ACTIVITY EXPENDITURES');
    PageUtils.clickLink('100% Federal Election Activity Payment');

    cy.get('#entity_type_dropdown').type(individualContactFormData.contact_type);
    cy.contains('LOOKUP').should('exist');
    cy.get('[role="searchbox"]').type(individualContactFormData.last_name.slice(0, 1));
    cy.contains(individualContactFormData.last_name).should('exist');
    cy.contains(individualContactFormData.last_name).click();

    TransactionDetailPage.enterScheduleFormData(defaultTransactionFormData);

    PageUtils.clickButton('Save');
    PageUtils.clickLink('100% Federal Election Activity Payment');
    cy.contains(individualContactFormData.first_name).should('exist');
    cy.contains(individualContactFormData.last_name).should('exist');
  });

  it('should test Independent Expenditure - Void Schedule E disbursement', () => {
    // Create an individual contact to be used with contact lookup
    ContactListPage.goToPage();
    PageUtils.clickButton('New');
    ContactListPage.enterFormData(organizationFormData);
    PageUtils.clickButton('Save');

    ContactListPage.goToPage();
    PageUtils.clickButton('New');
    ContactListPage.enterFormData(candidateFormData);
    PageUtils.clickButton('Save');

    ReportListPage.goToPage();
    ReportListPage.clickCreateButton();
    F3xCreateReportPage.enterFormData(defaultReportFormData);
    PageUtils.clickButton('Save and continue');

    PageUtils.clickSidebarItem('Add a disbursement');
    cy.contains('Add a disbursement').should('exist');
    PageUtils.clickLink('INDEPENDENT EXPENDITURES');
    PageUtils.clickLink('Independent Expenditure - Void');

    cy.get('#entity_type_dropdown').type(organizationFormData.contact_type);
    cy.contains('LOOKUP').should('exist');
    cy.get('[role="searchbox"]').type(organizationFormData.name.slice(0, 1));
    cy.contains(organizationFormData.name).should('exist');
    cy.contains(organizationFormData.name).click();

    TransactionDetailPage.enterSheduleFormDataForVoidExpenditure(independantExpVoidData, candidateFormData);

    PageUtils.clickButton('Save');
    PageUtils.clickLink('Independent Expenditure - Void');
    cy.contains(organizationFormData.name).should('exist');
  });
});
