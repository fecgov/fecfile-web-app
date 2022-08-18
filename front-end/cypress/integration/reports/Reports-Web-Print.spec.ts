// @ts-check

import { generateConfirmationDetails, generateFilingDetails, generateReportObject } from "../../support/generators/reports.spec";
import { generateTransactionObject } from "../../support/generators/transactions.spec";


const report = generateReportObject();
const transaction = generateTransactionObject();

describe('Test creating a report and submitting it for web print', () => {
  before('Logs in and clears existing reports', () => {
    cy.login();
    cy.deleteAllReports();
  });

  it('Creates a report', ()=>{
    cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
    cy.shortWait();
    cy.createReport(report);
  });

  it('Progresses to the Transaction Management Page', ()=>{
    cy.navigateToTransactionManagement();
  });

  it('Creates a transaction', ()=>{
    cy.createTransactionSchA(transaction);
  });

  it('Submits the report to web print', ()=>{
    cy.navigateReportSidebar('Review', 'View print preview');
    cy.get('button[label="Compile PDF"]').click();
    
    const today = new Date();
    const weekdays = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Aug','Sep','Nov','Dec'];

    const dateString = `${weekdays[today.getDay()-1]} ${months[today.getMonth()]} `+
                        `${today.getDate()} ${today.getFullYear()}`;

    cy.longWait();
    cy.contains('body', dateString).should('exist');
  });

  after('Cleanup', () => {
    cy.deleteAllReports();
    cy.logout();
  });
});