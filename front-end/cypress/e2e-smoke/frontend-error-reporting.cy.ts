describe('Frontend error reporting', () => {
  it('sends runtime error reports to the frontend error endpoint', () => {
    cy.on('uncaught:exception', (error) => {
      if (error.message.includes('Cypress runtime error probe')) {
        return false;
      }

      return true;
    });

    cy.intercept('POST', '/frontend-error-report', (req) => {
      expect(req.body).to.have.property('reports');
      expect(req.body.reports).to.be.an('array').and.have.length.greaterThan(0);

      const firstReport = req.body.reports[0];
      expect(firstReport).to.have.property('type', 'runtime');
      expect(firstReport).to.have.property('message').that.includes('Cypress runtime error probe');
      expect(firstReport).to.have.property('path');
      expect(firstReport).to.have.property('appEnvironment');

      req.reply({ statusCode: 204 });
    }).as('frontendErrorReport');

    cy.visit('/login');

    cy.window().then((win) => {
      win.dispatchEvent(new ErrorEvent('error', { message: 'Cypress runtime error probe' }));
      win.dispatchEvent(new Event('pagehide'));
    });

    cy.wait('@frontendErrorReport');
  });
});
