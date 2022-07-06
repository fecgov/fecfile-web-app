describe('This "Test" deletes reports currently in the database', () => {
  it('Logs in and deletes all reports', () => {
    cy.login();
    cy.wait(50);
    cy.deleteAllReports();
    cy.wait(50);
    cy.logout();
  });
});
