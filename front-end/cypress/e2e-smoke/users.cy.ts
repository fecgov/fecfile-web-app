import { LoginPage } from './pages/loginPage';
import { Roles, defaultFormData as userFormData } from './models/UserFormModel';
import { UsersPage } from './pages/usersPage';
import { UsersHelpers } from '../e2e-extended/users/users.helpers';

const uniqueUser = (overrides: Partial<typeof userFormData> = {}) => ({
  ...userFormData,
  email: `user_${Date.now()}_${Cypress._.random(1000, 9999)}@fec.gov`,
  ...overrides,
});

describe('Manage Users', () => {
  beforeEach(() => {
    LoginPage.login();
    UsersHelpers.deleteAllTestUsers();
  });

  it('should create a user', () => {
    const createdUser = uniqueUser();
    UsersPage.create(createdUser);
    cy.get('[data-cy="membership-submit"]').should('not.be.visible');
    UsersPage.assertRow(createdUser);
  });

  it('should display an error message when email is empty', () => {
    UsersPage.goToPage();
    UsersPage.openAddUserDialog();
    cy.get('@dialog').find('#email').clear({ force: true }).should('have.value', '');
    cy.get('@dialog').find('[data-cy="membership-submit"]').click();
    cy.get('@dialog').find('[data-cy="membership-submit"]').should('be.visible');
  });

  it('should edit role', () => {
    const createdUser = uniqueUser();
    UsersPage.create(createdUser);
    const formData = { ...createdUser, role: Roles.MANAGER };
    UsersPage.editRole(formData);
    cy.get('[data-cy="membership-submit"]').should('not.be.visible');
    UsersPage.assertRow(formData);
  });

  it('should delete User', () => {
    const createdUser = uniqueUser();
    UsersPage.create(createdUser);
    UsersPage.delete(createdUser.email);
    UsersPage.goToPage();
    cy.get('table tbody tr').contains('td', createdUser.email).should('not.exist');
  });
});
