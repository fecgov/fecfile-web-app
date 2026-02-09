import { PageUtils } from '../../../pages/pageUtils';
import { Receipts } from './receipts';
import { Disbursements, Contributions } from './disbursements';
import { Loans } from './loans';
import { Debts } from './debts';
import { StartTransactionMenu } from './menu';

export class StartTransaction {
  static Receipts() {
    PageUtils.clickSidebarItem(StartTransactionMenu.sidebar.addReceipt);
    return Receipts;
  }

  static Disbursements() {
    PageUtils.clickSidebarItem(StartTransactionMenu.sidebar.addDisbursement);
    return Disbursements;
  }

  // Used in Form 24 Reports
  static IndependentExpenditures() {
    PageUtils.clickSidebarItem(StartTransactionMenu.sidebar.addIndependentExpenditure);
    return Contributions;
  }

  static Loans() {
    PageUtils.clickSidebarItem(StartTransactionMenu.sidebar.addLoansAndDebts);
    cy.contains(StartTransactionMenu.accordion.loans).should('exist');
    PageUtils.clickAccordion(StartTransactionMenu.accordion.loans);
    return Loans;
  }

  static Debts() {
    PageUtils.clickSidebarItem(StartTransactionMenu.sidebar.addLoansAndDebts);
    cy.contains(StartTransactionMenu.accordion.debts).should('exist');
    PageUtils.clickAccordion(StartTransactionMenu.accordion.debts);
    return Debts;
  }
}
