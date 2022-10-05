describe('This "Test" deletes reports currently in the database', () => {
  it('Logs in and deletes all reports', () => {
    cy.login();
    cy.visit('/dashboard');
    cy.shortWait();
    cy.deleteAllReports();
    cy.deleteAllContacts();
  });
});
