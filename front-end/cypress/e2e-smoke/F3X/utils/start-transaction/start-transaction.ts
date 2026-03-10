import { Receipts } from './receipts';
import { Disbursements, Contributions } from './disbursements';
import { Loans } from './loans';
import { Debts } from './debts';
import { buildDataCy } from '../../../../utils/dataCy';

const clickSidebarLink = (label: string) => cy.getByDataCy(buildDataCy('report-sidebar', label, 'link')).click({ force: true });
const clickLoansDebtsSection = (label: string) =>
  cy.getByDataCy(buildDataCy('transactions', 'loans-and-debts', 'picker', label, 'section')).click({ force: true });

export class StartTransaction {
  static Receipts() {
    clickSidebarLink('Add a receipt');
    return Receipts;
  }

  static Disbursements() {
    clickSidebarLink('Add a disbursement');
    return Disbursements;
  }

  // Used in Form 24 Reports
  static IndependentExpenditures() {
    clickSidebarLink('Add an independent expenditure');
    return Contributions;
  }

  static Loans() {
    clickSidebarLink('Add loans and debts');
    clickLoansDebtsSection('LOANS');
    return Loans;
  }

  static Debts() {
    clickSidebarLink('Add loans and debts');
    clickLoansDebtsSection('DEBTS');
    return Debts;
  }
}
