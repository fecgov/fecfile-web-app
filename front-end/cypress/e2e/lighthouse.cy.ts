import * as _ from 'lodash';

describe('Generate lighthouse reports for every page', () => {
  xit('Login page', () => {
    cy.visit('/');
    cy.runLighthouse('other', 'login');
  });

  xit('Dashboard', () => {
    cy.visit('/dashboard');
    cy.runLighthouse('other', 'dashboard');
  });

  xit('Account Profile', () => {
    cy.visit('/profile/account');
    cy.runLighthouse('other', 'account-info');
  });

  xit('User Management', () => {
    cy.visit('/committee/users');
    cy.runLighthouse('other', 'user-management');
  });

  xit('Contact Management', () => {
    cy.visit('/contacts');
    cy.runLighthouse('contacts', 'contact-management');
  });

  xit('Report Management', () => {
    cy.visit('/reports');
    cy.runLighthouse('reports', 'report-management');
  });

  xit('Report Creation', () => {
    // cy.deleteAllReports();
    cy.visit('/reports');
    cy.contains('button', 'Create a new report').click();
    cy.get('button').contains('Start building report').click();
    cy.runLighthouse('reports', 'report-creation');
  });

  xit('Cash on Hand', () => {
    // cy.deleteAllReports();
    cy.visit('/reports');

    // const report = generateReportObject();
    // cy.createReport(report, false);
    // cy.contains('button', 'Save and continue').click();
    // cy.medWait();
    // cy.runLighthouse('reports', 'cash-on-hand');
    // cy.navigateToTransactionManagement();
  });

  xit('Summary page', () => {
    // getToTransactionsPage();

    cy.contains('.p-panelmenu-header-link', 'REVIEW').click();

    cy.contains('.p-menuitem-link', 'View summary page').click();

    cy.runLighthouse('reports', 'summary-page');
  });

  xit('Detailed summary page', () => {
    // getToTransactionsPage();

    cy.contains('.p-panelmenu-header-link', 'REVIEW').click();

    cy.contains('.p-menuitem-link', 'View detailed summary page').click();

    cy.runLighthouse('reports', 'detailed-summary-page');
  });

  xit('Print preview', () => {
    // getToTransactionsPage();

    cy.contains('.p-panelmenu-header-link', 'REVIEW').click();

    cy.contains('.p-menuitem-link', 'View print preview').click();

    cy.runLighthouse('reports', 'print-preview');
  });

  xit('Report memo', () => {
    // getToTransactionsPage();

    cy.contains('.p-panelmenu-header-link', 'REVIEW').click();

    cy.contains('.p-menuitem-link', 'Add a report level memo').click();

    cy.runLighthouse('reports', 'report-memo');
  });

  xit('Report confirm information', () => {
    // getToTransactionsPage();

    cy.contains('.p-panelmenu-header-link', 'SUBMIT YOUR REPORT').click();

    cy.contains('.p-menuitem-link', 'Confirm information').click();

    cy.runLighthouse('reports', 'submission-confirm-information');
  });

  xit('Report submission', () => {
    // getToTransactionsPage();

    cy.contains('.p-panelmenu-header-link', 'SUBMIT YOUR REPORT').click();

    cy.contains('.p-menuitem-link', 'Submit report').click();

    cy.runLighthouse('reports', 'submission');
  });

  xit('Report status', () => {
    // getToTransactionsPage();

    cy.contains('.p-panelmenu-header-link', 'SUBMIT YOUR REPORT').click();

    cy.contains('.p-menuitem-link', 'Report status').click();

    cy.runLighthouse('reports', 'submission-status');
  });

  xit('Transactions management', () => {
    // getToTransactionsPage();
    cy.runLighthouse('transactions', 'transaction-management');
  });

  xit('Transaction accordion', () => {
    // getToTransactionsPage();
    cy.contains('button', 'Add new transaction').click();
    cy.get('p-accordiontab').first().click();
    cy.runLighthouse('transactions', 'transaction-accordion');
  });

  // const transaction_groups = ['A', 'B', 'C', 'D', 'E', 'F', 'AG'];
  // for (const group of transaction_groups) {
  //   const forms = getTransactionFormsByTransactionGroup(group);
  //   if (forms.length > 0) {
  //     const form = _.sample(forms);
  //     const transaction = generateTransactionObject({
  //       transaction_name: form?.transaction_name,
  //       childTransactions: [],
  //     });

  //     xit(`Transaction creation - group ${group}`, () => {
  //       getToTransactionsPage();
  //       cy.createTransactionSchA(transaction);
  //       cy.get('tr.ng-star-inserted > :nth-child(1) > a').last().click();
  //       cy.runLighthouse('transactions', `transaction-creation-group-${group}`);
  //     });
  //   }
  // }

  after('Logs in and deletes all reports', () => {
    cy.visit('/dashboard');
    // cy.deleteAllReports();
    // cy.deleteAllContacts();
  });
});
