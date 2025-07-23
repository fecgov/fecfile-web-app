describe('Cookie Disabled', () => {
  it('should redirect to the cookies-disabled page if cookies are blocked', () => {
    cy.visit('/', {
      onBeforeLoad: (win) => {
        Object.defineProperty(win.document, 'cookie', {
          get: () => '',
          set: () => {
            throw new Error('Cannot set cookies');
          },
          configurable: true,
        });
      },
    });

    cy.url().should('include', '/cookies-disabled');
    cy.contains('Cookies are disabled in your browser').should('be.visible');
  });
});
