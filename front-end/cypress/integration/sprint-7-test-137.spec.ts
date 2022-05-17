// @ts-check

import { RandomDate, DateToString, GenerateReportObject } from '../support/reports.spec';

describe('QA Test Script #137 (Sprint 7)', () => {
  const FromDate: Date = RandomDate();
  const ThroughDate: Date = RandomDate();

  it('Step 1: Navigate to contacts page', () => {
    cy.visit('/dashboard');
    cy.url().should('contain', '/dashboard');
    cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
    cy.url().should('contain', '/reports');
  });

  it('Step 2: Open a New Report', () => {
    const Report: object = GenerateReportObject();
    cy.EnterReport(Report, false); //Enter a report without saving it
    cy.get('app-create-f3x-step1').contains('FEC Form 3X').should('exist');
  });

  it('Step 3: Check for the existence of the FROM and TO fields', () => {
    cy.get('label[for="coverage_from_date"]').should('exist');
    cy.get('label[for="coverage_through_date"]').should('exist');
  });

  it('Step 4: Enter any date into the FROM and TO fields', () => {
    cy.CalendarSetValue("p-calendar[FormControlName='coverage_from_date']", FromDate);
    cy.wait(250);
    cy.CalendarSetValue("p-calendar[FormControlName='coverage_through_date']", ThroughDate);
    cy.wait(50);
  });

  it('Step 5: Checks that the dates entered are displayed in their fields', () => {
    cy.get('p-calendar[FormControlName="coverage_from_date"]')
      .find('input')
      .should('have.value', DateToString(FromDate));
    cy.get('p-calendar[FormControlName="coverage_through_date"]')
      .find('input')
      .should('have.value', DateToString(ThroughDate));
  });
});
