describe('Generates lighthouse reports for every page', () => {
  it('Login page', () => {
    cy.visit('/');
    cy.runLighthouse('other', 'login');
  });

  it('Dashboard', () => {
    cy.login();
    cy.visit('/dashboard');
    cy.runLighthouse('other', 'dashboard');
  });

  it('Account Profile', () => {
    cy.login();
    cy.visit('/profile/account');
    cy.runLighthouse('other', 'account-info');
  });

  it('User Management', () => {
    cy.login();
    cy.visit('/committee/users');
    cy.runLighthouse('other', 'user-management');
  });

  it('Contact Management', () => {
    cy.login();
    cy.visit('/contacts');
    cy.runLighthouse('contacts', 'contact-management');
  });

  it('Contact Creation', () => {
    cy.login();
    cy.visit('/contacts');
    cy.medWait();
    cy.contains('button', 'New').click();
    cy.shortWait();

    cy.dropdownSetValue('p-dropdown[formControlName="type"]', 'Individual');
    cy.shortWait();
    cy.runLighthouse('contacts', 'contact-form-individual');

    cy.dropdownSetValue('p-dropdown[formControlName="type"]', 'Candidate');
    cy.shortWait();
    cy.runLighthouse('contacts', 'contact-form-candidate');

    cy.dropdownSetValue('p-dropdown[formControlName="type"]', 'Committee');
    cy.shortWait();
    cy.runLighthouse('contacts', 'contact-form-committee');

    cy.dropdownSetValue('p-dropdown[formControlName="type"]', 'Organization');
    cy.shortWait();
    cy.runLighthouse('contacts', 'contact-form-organization');
  });

  after('Logs in and deletes all reports', () => {
    cy.login();
    cy.visit('/dashboard');
    cy.shortWait();
    cy.deleteAllReports();
    cy.deleteAllContacts();
  });
});
