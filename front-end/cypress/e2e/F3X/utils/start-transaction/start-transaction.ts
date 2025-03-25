import { PageUtils } from '../../../pages/pageUtils';
import { Receipts } from './receipts';
import { Disbursements, Independent } from './disbursements';
import { Loans } from './loans';
import { Debts } from './debts';

export class StartTransaction {
  static Receipts() {
    PageUtils.clickSidebarItem('Add a receipt');
    return Receipts;
  }

  static Disbursements() {
    PageUtils.clickSidebarItem('Add a disbursement');
    return Disbursements;
  }

  // Used in Form 24 Reports
  static IndependentExpenditures() {
    PageUtils.clickSidebarItem('Add an independent expenditure');
    return Independent;
  }

  static Loans() {
    PageUtils.clickSidebarItem('Add loans and debts');
    cy.contains('LOANS').should('exist');
    PageUtils.clickAccordion('LOANS');
    return Loans;
  }

  static Debts() {
    PageUtils.clickSidebarItem('Add loans and debts');
    cy.contains('DEBTS').should('exist');
    PageUtils.clickAccordion('DEBTS');
    return Debts;
  }
}
