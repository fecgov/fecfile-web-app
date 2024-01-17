import { ContactListPage } from '../pages/contactListPage';
import { LoginPage } from '../pages/loginPage';
import { PageUtils } from '../pages/pageUtils';
import { ReportListPage } from '../pages/reportListPage';
import { TransactionDetailPage } from '../pages/transactionDetailPage';
import { defaultFormData as individualContactFormData } from '../models/ContactFormModel';
import { defaultScheduleFormData as defaultTransactionFormData, } from '../models/TransactionFormModel';


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
    ContactListPage.createIndividual();
    ReportListPage.createF3X();

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

  it('should ', () => {
    // Create an individual contact to be used with contact lookup
    ContactListPage.createCandidate();
    ReportListPage.createF3X();

    PageUtils.clickSidebarItem('Add a disbursement');
    cy.contains('Add a disbursement').should('exist');
    PageUtils.clickLink('INDEPENDENT EXPENDITURES');
    PageUtils.clickLink('Independent Expenditure - Void');

    cy.get('#entity_type_dropdown').type(organizationFormData.contact_type);
    cy.contains('LOOKUP').should('exist');
    cy.get('[role="searchbox"]').type(organizationFormData.name.slice(0, 1));
    cy.contains(organizationFormData.name).should('exist');
    cy.contains(organizationFormData.name).click();

    TransactionDetailPage.enterSheduleFormDataForVoidExpenditure(independentExpVoidData, candidateFormData);

    PageUtils.clickButton('Save');
    PageUtils.clickLink('Independent Expenditure - Void');
    cy.contains(organizationFormData.name).should('exist');
  });
});
