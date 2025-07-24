import { LoginPage } from './pages/loginPage';
import { ProfileAccountPage } from './pages/profileAccountPage';
import { ProfileUserListPage } from './pages/profileUserListPage';

describe('Manage profile', () => {
  beforeEach(() => {
    LoginPage.login();
  });

  it('Can view the Account Info page', () => {
    ProfileAccountPage.goToPage();
    cy.get('#committee_id').should('have.value', 'C99999999');
  });

  it('Can view the Users table', () => {
    ProfileUserListPage.goToPage();
    cy.contains('Testson, Test').should('exist');
  });
});
