// @ts-check

import { date as randomDate } from '../../support/generators/generators.spec';
import { dateToString } from '../../support/reports.spec';
import { generateReportObject } from '../../support/generators/reports.spec';

describe('QA Test Script #137 (Sprint 7)', () => {
  const fromDate: Date = randomDate();
  const throughDate: Date = randomDate();

  it('Step 1: Navigate to reports page', () => {
    cy.visit('/dashboard');
    cy.url().should('contain', '/dashboard');
    cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
    cy.url().should('contain', '/reports');
  });

  it('Step 2: Open a New Report', () => {
    const report: object = generateReportObject();
    cy.enterReport(report, false); //Enter a report without saving it
    cy.get('app-create-f3x-step1').contains('FEC Form 3X').should('exist');
  });

  it('Step 3: Check for the existence of the FROM and TO fields', () => {
    cy.get('label[for="coverage_from_date"]').should('exist');
    cy.get('label[for="coverage_through_date"]').should('exist');
  });

  it('Step 4: Enter any date into the FROM and TO fields', () => {
    cy.calendarSetValue("p-calendar[FormControlName='coverage_from_date']", fromDate);
    cy.medWait();
    cy.calendarSetValue("p-calendar[FormControlName='coverage_through_date']", throughDate);
    cy.medWait();
  });

  it('Step 5: Checks that the dates entered are displayed in their fields', () => {
    cy.get('p-calendar[FormControlName="coverage_from_date"]')
      .find('input')
      .should('have.value', dateToString(fromDate));
    cy.get('p-calendar[FormControlName="coverage_through_date"]')
      .find('input')
      .should('have.value', dateToString(throughDate));
  });
});
