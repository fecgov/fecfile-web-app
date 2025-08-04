import { LoginPage } from './pages/loginPage';
import { PageUtils } from './pages/pageUtils';
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

  it('Can navigate to the Committee members via the navbar', () => {
    const alias = PageUtils.getAlias('');
    cy.visit('/reports');
    cy.get('#navbarProfileDropdownMenuLink').click();
    cy.get(alias).find('.p-popover').contains('Users').click();
    cy.location('pathname').should('include', '/members');
  });

  it('Can navigate to the Profile Account page via the navbar', () => {
    const alias = PageUtils.getAlias('');
    cy.intercept('/profile').as('account');
    cy.visit('/reports');

    cy.get('#navbarProfileDropdownMenuLink').click();
    cy.get(alias).find('.p-popover').contains('Account').click();
    cy.location('pathname').should('include', '/committee');
  });
});
