import { PageUtils } from '../../../pages/pageUtils';
import { Receipts } from './receipts';
import { Disbursements, Contributions } from './disbursements';
import { Loans } from './loans';
import { Debts } from './debts';

export class StartTransaction {
  static Receipts() {
    PageUtils.clickSidebarItem('Add a receipt');
    PageUtils.waitForTransactionTypePicker();
    return Receipts;
  }

  static Disbursements() {
    PageUtils.clickSidebarItem('Add a disbursement');
    PageUtils.waitForTransactionTypePicker();
    return Disbursements;
  }

  // Used in Form 24 Reports
  static IndependentExpenditures() {
    PageUtils.clickSidebarItem('Add an independent expenditure');
    PageUtils.waitForTransactionTypePicker();
    return Contributions;
  }

  static Loans() {
    PageUtils.clickSidebarItem('Add loans and debts');
    PageUtils.waitForTransactionTypePicker();
    cy.contains('LOANS').should('exist');
    PageUtils.clickAccordion('LOANS');
    return Loans;
  }

  static Debts() {
    PageUtils.clickSidebarItem('Add loans and debts');
    PageUtils.waitForTransactionTypePicker();
    cy.contains('DEBTS').should('exist');
    PageUtils.clickAccordion('DEBTS');
    return Debts;
  }
}
