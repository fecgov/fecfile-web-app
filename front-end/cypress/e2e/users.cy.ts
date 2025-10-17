import { LoginPage } from './pages/loginPage';
import { Roles, defaultFormData as userFormData } from './models/UserFormModel';
import { UsersPage } from './pages/usersPage';
import { PageUtils } from './pages/pageUtils';

describe('Manage Users', () => {
  beforeEach(() => {
    LoginPage.login();
    PageUtils.switchCommittee('c94c5d1a-9e73-464d-ad72-b73b5d8667a9');
  });

  it('should create a user', () => {
    cy.intercept('GET', 'http://localhost:8080/api/v1/committee-members/').as('GetMembers');
    UsersPage.create(userFormData);
    cy.wait('@GetMembers');
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
