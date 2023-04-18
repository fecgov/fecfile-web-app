import { LoginPage } from './pages/loginPage';
import { ProfileAccountPage } from './pages/profileAccountPage';
import { ProfileUserListPage } from './pages/profileUserListPage';

describe('Manage profile', () => {
  beforeEach(() => {
    LoginPage.login();
  });

  xit('Can view the Account Info page', () => {
    ProfileAccountPage.goToPage();
    cy.runLighthouse('profile', 'account-info');

    cy.contains('C00601211').should('exist');
  });

  it('Can view the Users table', () => {
    ProfileUserListPage.goToPage();
    cy.runLighthouse('profile', 'users-table');

    cy.contains('Testson, Test').should('exist');
  });
});
