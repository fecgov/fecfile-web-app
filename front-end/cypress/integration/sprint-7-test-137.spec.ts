// @ts-check

describe('QA Test Script #137 (Sprint 7)', () => {
  it('Step 1: Navigate to contacts page', () => {
    cy.visit('/dashboard');
    cy.url().should('contain', '/dashboard');
    cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
    cy.url().should('contain', '/reports');
  });

  it('Step 2: Open a New Report', () => {
    cy.get("button[label='Create a new report']").click();
    cy.wait(50);
    cy.get('app-create-f3x-step1').contains('FEC Form 3X').should('exist');
  });

  it('Step 3: Check for the existence of the FROM and TO fields', () => {
    cy.get('label[for="coverage_from_date"]').should('exist');
    cy.get('label[for="coverage_through_date"]').should('exist');
  });

  it('Step 4: Enter any date into the FROM and TO fields', () => {
    cy.get('p-calendar[FormControlName="coverage_from_date"]').click();
    cy.get('.p-datepicker-group').find('td').first().click();
    cy.wait(250);

    cy.get('p-calendar[FormControlName="coverage_through_date"]').click();
    cy.get('.p-datepicker-group').find('td').first().click();
    cy.wait(250);
  });

  it('Step 5: Checks that the dates entered are displayed in their fields', () => {
    cy.get('p-calendar[FormControlName="coverage_from_date"]').find('input').should('have.value', '05/01/2022');
    cy.get('p-calendar[FormControlName="coverage_through_date"]').find('input').should('have.value', '05/01/2022');
  });
});
