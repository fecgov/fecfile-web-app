import { LoginPage, setCommitteeEligibleReportTypes } from './pages/loginPage';
import { ReportListPage } from './pages/reportListPage';

describe('Manage profile', () => {
  beforeEach(() => {
    LoginPage.login();
  });

  it('Should be able to create a Form 99 report', () => {
    ReportListPage.goToPage();
    ReportListPage.clickCreateAndSelectForm('', false, false);

    cy.get('p-selectitem').should('have.length', 1);
    cy.get('p-selectitem').contains("Form 99").should('exist');
  });

  it('Should be able to create F99 and F3X reports when eligible', () => {
    setCommitteeEligibleReportTypes(["F99", "F3X"]);

    ReportListPage.goToPage();
    ReportListPage.clickCreateAndSelectForm('', false, false);

    cy.get('p-selectitem').should('have.length', 2);
    cy.get('p-selectitem').contains("Form 99").should('exist');
    cy.get('p-selectitem').contains("Form 3X").should('exist');
  });

  it('Should be able to create F99, F3X, F24, and F1M reports when eligible', () => {
    setCommitteeEligibleReportTypes(["F99", "F3X", "F24", "F1M"]);

    ReportListPage.goToPage();
    ReportListPage.clickCreateAndSelectForm('', false, false);

    cy.get('p-selectitem').should('have.length', 4);
    cy.get('p-selectitem').contains("Form 99").should('exist');
    cy.get('p-selectitem').contains("Form 3X").should('exist');
    cy.get('p-selectitem').contains("Form 24").should('exist');
    cy.get('p-selectitem').contains("Form 1M").should('exist');
  });
});