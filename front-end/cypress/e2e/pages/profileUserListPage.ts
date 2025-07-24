import { PageUtils } from './pageUtils';

export class ProfileUserListPage {
  static goToPage() {
    cy.visit('/committee/members');
  }
}
