import * as _ from 'lodash';
import { generateReportObject } from '../../support/generators/reports.spec';
import {
  generateTransactionObject,
  getTransactionFormsByTransactionGroup,
} from '../../support/generators/transactions.spec';

function getToTransactionsPage() {
  cy.deleteAllReports();
  cy.medWait();
  cy.visit('/reports');
  const report = generateReportObject();
  cy.createReport(report);
  cy.navigateToTransactionManagement();
  cy.shortWait();
}

describe('Generates lighthouse reports for every page', () => {
  it('Login page', () => {
    cy.visit('/');
    cy.runLighthouse('other', 'login');
  });

  it('Dashboard', () => {
    cy.login();
    cy.visit('/dashboard');
    cy.runLighthouse('other', 'dashboard');
  });

  it('Account Profile', () => {
    cy.login();
    cy.visit('/profile/account');
    cy.runLighthouse('other', 'account-info');
  });

  it('User Management', () => {
    cy.login();
    cy.visit('/committee/users');
    cy.runLighthouse('other', 'user-management');
  });

  it('Contact Management', () => {
    cy.login();
    cy.visit('/contacts');
    cy.runLighthouse('contacts', 'contact-management');
  });

  it('Report Management', () => {
    cy.login();
    cy.visit('/reports');
    cy.runLighthouse('reports', 'report-management');
  });

  it('Report Creation', () => {
    cy.login();
    cy.deleteAllReports();
    cy.visit('/reports');
    cy.contains('button', 'Create a new report').click();
    cy.get('button').contains('Start building report').click();
    cy.shortWait();
    cy.runLighthouse('reports', 'report-creation');
  });

  it('Cash on Hand', () => {
    cy.login();
    cy.deleteAllReports();
    cy.visit('/reports');

    const report = generateReportObject();
    cy.createReport(report, false);
    cy.contains('button', 'Save and continue').click();
    cy.medWait();
    cy.runLighthouse('reports', 'cash-on-hand');
    cy.navigateToTransactionManagement();
  });

  it('Summary page', () => {
    cy.login();
    getToTransactionsPage();

    cy.contains('.p-panelmenu-header-link', 'REVIEW').click();
    cy.shortWait();

    cy.contains('.p-menuitem-link', 'View summary page').click();
    cy.shortWait();

    cy.runLighthouse('reports', 'summary-page');
  });

  it('Detailed summary page', () => {
    cy.login();
    getToTransactionsPage();

    cy.contains('.p-panelmenu-header-link', 'REVIEW').click();
    cy.shortWait();

    cy.contains('.p-menuitem-link', 'View detailed summary page').click();
    cy.shortWait();

    cy.runLighthouse('reports', 'detailed-summary-page');
  });

  it('Print preview', () => {
    cy.login();
    getToTransactionsPage();

    cy.contains('.p-panelmenu-header-link', 'REVIEW').click();
    cy.shortWait();

    cy.contains('.p-menuitem-link', 'View print preview').click();
    cy.shortWait();

    cy.runLighthouse('reports', 'print-preview');
  });

  it('Report memo', () => {
    cy.login();
    getToTransactionsPage();

    cy.contains('.p-panelmenu-header-link', 'REVIEW').click();
    cy.shortWait();

    cy.contains('.p-menuitem-link', 'Add a report level memo').click();
    cy.shortWait();

    cy.runLighthouse('reports', 'report-memo');
  });

  it('Report confirm information', () => {
    cy.login();
    getToTransactionsPage();

    cy.contains('.p-panelmenu-header-link', 'SUBMIT YOUR REPORT').click();
    cy.shortWait();

    cy.contains('.p-menuitem-link', 'Confirm information').click();
    cy.shortWait();

    cy.runLighthouse('reports', 'submission-confirm-information');
  });

  it('Report submission', () => {
    cy.login();
    getToTransactionsPage();

    cy.contains('.p-panelmenu-header-link', 'SUBMIT YOUR REPORT').click();
    cy.shortWait();

    cy.contains('.p-menuitem-link', 'Submit report').click();
    cy.shortWait();

    cy.runLighthouse('reports', 'submission');
  });

  it('Report status', () => {
    cy.login();
    getToTransactionsPage();

    cy.contains('.p-panelmenu-header-link', 'SUBMIT YOUR REPORT').click();
    cy.shortWait();

    cy.contains('.p-menuitem-link', 'Report status').click();
    cy.shortWait();

    cy.runLighthouse('reports', 'submission-status');
  });

  it('Transactions management', () => {
    cy.login();
    getToTransactionsPage();
    cy.runLighthouse('transactions', 'transaction-management');
  });

  it('Transaction accordion', () => {
    cy.login();
    getToTransactionsPage();
    cy.contains('button', 'Add new transaction').click();
    cy.get('p-accordiontab').first().click();
    cy.shortWait();
    cy.runLighthouse('transactions', 'transaction-accordion');
  });

  const transaction_groups = ['A', 'B', 'C', 'D', 'E', 'F', 'AG'];
  for (const group of transaction_groups) {
    const forms = getTransactionFormsByTransactionGroup(group);
    if (forms.length > 0) {
      const form = _.sample(forms);
      const transaction = generateTransactionObject({
        transaction_name: form?.transaction_name,
        childTransactions: [],
      });

      it(`Transaction creation - group ${group}`, () => {
        cy.login();
        getToTransactionsPage();
        cy.createTransactionSchA(transaction);
        cy.get('tr.ng-star-inserted > :nth-child(1) > a').last().click();
        cy.runLighthouse('transactions', `transaction-creation-group-${group}`);
      });
    }
  }

  after('Logs in and deletes all reports', () => {
    cy.login();
    cy.visit('/dashboard');
    cy.shortWait();
    cy.deleteAllReports();
    cy.deleteAllContacts();
  });
});
