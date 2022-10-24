// @ts-check

import { generateContactToFit } from '../../support/generators/contacts.spec';
import { generateReportObject } from '../../support/generators/reports.spec';
import { generateTransactionObject } from '../../support/generators/transactions.spec';

const report = generateReportObject();
const transaction = generateTransactionObject();
const contact = generateContactToFit(transaction);

describe('Test creating a report and submitting it for web print', () => {
  before('Logs in and clears existing reports', () => {
    cy.login();
    cy.deleteAllReports();
  });

  it('', () => {
    cy.visit('/dashboard');

    //Creates a report
    cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
    cy.shortWait();
    cy.createReport(report);

    //Progresses to the Transaction Management Page
    cy.navigateToTransactionManagement();

    //Creates a transaction
    cy.createTransactionSchA(transaction, contact);

    //Submits the report to web print
    cy.navigateReportSidebar('Review', 'View print preview');
    cy.get('button[label="Compile PDF"]').click();

    const today = new Date();
    let strDay: string = today.getDate().toString();
    if (strDay.length == 1) {
      strDay = '0' + strDay;
    }
    const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const dateString =
      `${weekdays[today.getDay() - 1]} ${months[today.getMonth()]} ` + `${strDay} ${today.getFullYear()}`;

    cy.longWait();
    cy.longWait();
    cy.contains('h2', dateString).should('exist');

    cy.deleteAllReports();
  });
});
