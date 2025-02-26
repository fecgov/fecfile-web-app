import { LoginPage } from './pages/loginPage';
import { Roles, defaultFormData as userFormData } from './models/UserFormModel';
import { UsersPage } from './pages/usersPage';

describe('Manage Users', () => {
  beforeEach(() => {
    LoginPage.login();
  });

  it('should create a user', () => {
    UsersPage.create(userFormData);
    cy.wait(500);
    cy.get('[data-cy="membership-submit"]').should('not.be.visible');
    UsersPage.assertRow(userFormData);
  });

  it('should display an error message when email is empty', () => {
    const formData = { ...userFormData, email: '' };
    UsersPage.create(formData);
    cy.get('[data-cy="membership-submit"]').should('be.visible');
  });

  it('should edit role', () => {
    const formData = { ...userFormData, role: Roles.MANAGER };
    UsersPage.editRole(formData);
    cy.get('[data-cy="membership-submit"]').should('not.be.visible');
    UsersPage.assertRow(formData);
  });

  it('should delete User', () => {
    UsersPage.delete(userFormData.email);
    cy.get('table tbody tr').contains('td', userFormData.email).should('not.exist');
  });
});
