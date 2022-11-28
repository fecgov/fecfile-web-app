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
  xit('Login page', () => {
    cy.visit('/');
    cy.runLighthouse('other', 'login');
  });

  xit('Dashboard', () => {
    cy.login();
    cy.visit('/dashboard');
    cy.runLighthouse('other', 'dashboard');
  });

  xit('Account Profile', () => {
    cy.login();
    cy.visit('/profile/account');
    cy.runLighthouse('other', 'account-info');
  });

  xit('User Management', () => {
    cy.login();
    cy.visit('/committee/users');
    cy.runLighthouse('other', 'user-management');
  });

  xit('Contact Management', () => {
    cy.login();
    cy.visit('/contacts');
    cy.runLighthouse('contacts', 'contact-management');
  });

  xit('Contact Creation', () => {
    cy.login();
    cy.visit('/contacts');
    cy.medWait();
    cy.contains('button', 'New').click();
    cy.shortWait();

    cy.dropdownSetValue('p-dropdown[formControlName="type"]', 'Individual');
    cy.shortWait();
    cy.runLighthouse('contacts', 'contact-form-individual');

    cy.dropdownSetValue('p-dropdown[formControlName="type"]', 'Candidate');
    cy.shortWait();
    cy.runLighthouse('contacts', 'contact-form-candidate');

    cy.dropdownSetValue('p-dropdown[formControlName="type"]', 'Committee');
    cy.shortWait();
    cy.runLighthouse('contacts', 'contact-form-committee');

    cy.dropdownSetValue('p-dropdown[formControlName="type"]', 'Organization');
    cy.shortWait();
    cy.runLighthouse('contacts', 'contact-form-organization');
  });

  xit('Report Management', () => {
    cy.login();
    cy.visit('/reports');
    cy.runLighthouse('reports', 'report-management');
  });

  xit('Report Creation', () => {
    cy.login();
    cy.deleteAllReports();
    cy.visit('/reports');
    cy.contains('button', 'Create a new report').click();
    cy.shortWait();
    cy.runLighthouse('reports', 'report-creation');
  });

  xit('Date Picker', () => {
    cy.login();
    cy.visit('/reports');
    cy.deleteAllReports();
    cy.contains('button', 'Create a new report').click();
    cy.shortWait();

    cy.get('p-calendar[formControlName="coverage_from_date"]').click();
    cy.runLighthouse('other', 'date-picker');
  });

  xit('Cash on Hand', () => {
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

  xit('Summary page', () => {
    cy.login();
    getToTransactionsPage();

    cy.contains('.p-panelmenu-header-link', 'REVIEW').click();
    cy.shortWait();

    cy.contains('.p-menuitem-link', 'View summary page').click();
    cy.shortWait();

    cy.runLighthouse('reports', 'summary-page');
  });

  xit('Detailed summary page', () => {
    cy.login();
    getToTransactionsPage();

    cy.contains('.p-panelmenu-header-link', 'REVIEW').click();
    cy.shortWait();

    cy.contains('.p-menuitem-link', 'View detailed summary page').click();
    cy.shortWait();

    cy.runLighthouse('reports', 'detailed-summary-page');
  });

  xit('Print preview', () => {
    cy.login();
    getToTransactionsPage();

    cy.contains('.p-panelmenu-header-link', 'REVIEW').click();
    cy.shortWait();

    cy.contains('.p-menuitem-link', 'View print preview').click();
    cy.shortWait();

    cy.runLighthouse('reports', 'print-preview');
  });

  xit('Report memo', () => {
    cy.login();
    getToTransactionsPage();

    cy.contains('.p-panelmenu-header-link', 'REVIEW').click();
    cy.shortWait();

    cy.contains('.p-menuitem-link', 'Add a report level memo').click();
    cy.shortWait();

    cy.runLighthouse('reports', 'report-memo');
  });

  xit('Report confirm information', () => {
    cy.login();
    getToTransactionsPage();

    cy.contains('.p-panelmenu-header-link', 'SUBMIT YOUR REPORT').click();
    cy.shortWait();

    cy.contains('.p-menuitem-link', 'Confirm information').click();
    cy.shortWait();

    cy.runLighthouse('reports', 'submission-confirm-information');
  });

  xit('Report submission', () => {
    cy.login();
    getToTransactionsPage();

    cy.contains('.p-panelmenu-header-link', 'SUBMIT YOUR REPORT').click();
    cy.shortWait();

    cy.contains('.p-menuitem-link', 'Submit report').click();
    cy.shortWait();

    cy.runLighthouse('reports', 'submission');
  });

  xit('Report status', () => {
    cy.login();
    getToTransactionsPage();

    cy.contains('.p-panelmenu-header-link', 'SUBMIT YOUR REPORT').click();
    cy.shortWait();

    cy.contains('.p-menuitem-link', 'Report status').click();
    cy.shortWait();

    cy.runLighthouse('reports', 'submission-status');
  });

  xit('Transactions management', () => {
    cy.login();
    getToTransactionsPage();
    cy.runLighthouse('transactions', 'transaction-management');
  });

  xit('Transaction accordion', () => {
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
        cy.get('tr.ng-star-inserted > :nth-child(1) > a').first().click();
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
