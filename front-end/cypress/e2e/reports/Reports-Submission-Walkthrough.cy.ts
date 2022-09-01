// @ts-check

import { generateConfirmationDetails, generateFilingDetails, generateReportObject } from "../../support/generators/reports.spec";
import { generateTransactionObject } from "../../support/generators/transactions.spec";


const report = generateReportObject();
const transaction = generateTransactionObject();
const confirmationDetails = generateConfirmationDetails();
const filingDetails = generateFilingDetails();

describe('Test creating and submitting a report', () => {
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

  it('Checks pre-existing confirmation details', ()=>{
    cy.navigateReportSidebar('Submit', 'Confirm information');
    
    cy.get('input[formControlName="confirmation_email_1"]')
      .should('have.value', 'test@pacyourbags.csv');
    
    cy.get('p-radiobutton[label="YES"]').find('div').last().click({force: true});

    cy.get('input[formControlName="street_1"]')
      .should('have.value','920 TEST STREET SUITE 300');
    cy.get('input[formControlName="city"]')
      .should('have.value','KANSAS CITY')
    cy.get('input[formControlName="zip"]')
      .should('have.value', '64105')
    cy.get('p-dropdown[formControlName="state"]')
      .should('contain', 'Missouri');

    cy.get('p-radiobutton[label="NO"]').find('div').last().click({force: true});
  });

  it('Enters confirmation details', ()=>{
    cy.enterConfirmationDetails(confirmationDetails);
  });

  it('Checks for pre-existing filing details', ()=>{
    cy.get('input[formControlName="treasurer_first_name"]')
      .should('have.value','Test');
    cy.get('input[formControlName="treasurer_last_name"]')
      .should('have.value','McTest');
    cy.get('input[formControlName="treasurer_middle_name"]')
      .should('have.value','Thomas');
    cy.get('input[formControlName="treasurer_prefix"]')
      .should('have.value','Mr.');
    cy.get('input[formControlName="treasurer_suffix"]')
      .should('have.value','III');
  });

  it('Submits the report', ()=>{
    cy.enterFilingDetails(filingDetails);
  });

  it('Checks for confirmation emails', ()=>{
    cy.get('body').should('contain', confirmationDetails.email_1);
    if (confirmationDetails.email_2){
      cy.get('body').should('contain', confirmationDetails.email_2);
    }
  });

  it(`Checks for report code ${report.report_code}`, ()=>{
    cy.get('body').should('contain', report.report_code);
  });

  it('Checks for Coverage Dates', ()=>{
    const months = ['January','February','March',
                    'April','May','June',
                    'July','August','September',
                    'October','November','December'];

    for (const dateString of [report.coverage_from_date, report.coverage_through_date]){
      const d = new Date(dateString);
      const date = `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
      cy.get('body').should('contain', date)
    }
  });

  after('Cleanup', () => {
    cy.deleteAllReports();
    cy.logout();
  });
});