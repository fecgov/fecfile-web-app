describe('My First Test', () => {
  it('Visits the initial project page', () => {
    cy.visit('/');
    cy.contains('Email');
    cy.contains('Committee ID');
  });
});
