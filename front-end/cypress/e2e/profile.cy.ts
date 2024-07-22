import { LoginPage } from './pages/loginPage';
import { ProfileAccountPage } from './pages/profileAccountPage';
import { ProfileUserListPage } from './pages/profileUserListPage';

describe('Manage profile', () => {
  beforeEach(() => {
    cy.request({
      method: 'GET',
      url: 'http://localhost:8080/api/v1/status/',
    }).then((response) => {
      cy.log(response.status.toString());
    });
    LoginPage.login();
  });

  it('Can view the Account Info page', () => {
    ProfileAccountPage.goToPage();
    cy.runLighthouse('profile', 'account-info');

    cy.contains('C99999999').should('exist');
  });

  it('Can view the Users table', () => {
    ProfileUserListPage.goToPage();
    cy.runLighthouse('profile', 'users-table');

    cy.contains('Testson, Test').should('exist');
  });
});
