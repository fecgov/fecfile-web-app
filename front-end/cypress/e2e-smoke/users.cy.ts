import { LoginPage } from './pages/loginPage';
import { Roles, defaultFormData as userFormData } from './models/UserFormModel';
import { UsersPage } from './pages/usersPage';
import { ApiUtils } from './utils/api';
import { SmokeAliases } from './utils/aliases';

const USERS_SPEC_ALIAS_SOURCE = 'usersSpec';

describe('Manage Users', () => {
  beforeEach(() => {
    LoginPage.login();
  });

  it('should create a user', () => {
    cy.intercept('GET', ApiUtils.apiRoutePathname('/committee-members/')).as(
      SmokeAliases.network.named('GetMembers', USERS_SPEC_ALIAS_SOURCE),
    );
    UsersPage.create(userFormData);
    cy.wait(`@${SmokeAliases.network.named('GetMembers', USERS_SPEC_ALIAS_SOURCE)}`);
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
