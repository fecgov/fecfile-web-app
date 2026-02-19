import { defaultLoanFormData, LoanFormData } from '../../models/TransactionFormModel';
import { ContactLookup } from '../../pages/contactLookup';
import { currentYear, PageUtils } from '../../pages/pageUtils';
import { ReportListPage } from '../../pages/reportListPage';
import { TransactionDetailPage } from '../../pages/transactionDetailPage';
import { makeTransaction } from '../../requests/methods';
import {
  Authorizor,
  buildLoanAgreement,
  buildLoanFromBank,
  buildLoanReceipt,
  LoanInfo,
} from '../../requests/library/transactions';
import { DataSetup, Setup } from '../setup';
import { StartTransaction } from './start-transaction/start-transaction';

export function assertNoDeleteButtonInTransactionRow(
  transactionLabel: string,
  containerSelector = '',
) {
  const row = containerSelector
    ? cy.get(containerSelector).contains('tr', transactionLabel)
    : cy.contains('tr', transactionLabel);

  row.first().within(() => {
    cy.get('button').each(($button) => {
      const innerHTML = $button.html();
      if (innerHTML.includes('Delete')) {
        throw new Error('A button contains "Delete", test failed.');
      }
    });
  });
}

export function setupLoanFromBank(setup: Setup) {
  return DataSetup(setup).then((result: any) => {
    const organization = result.organization;
    const reportId = result.report;

    const loanInfo: LoanInfo = {
      loan_amount: 60000,
      loan_incurred_date: `${currentYear}-04-27`,
      loan_due_date: `${currentYear}-04-27`,
      loan_interest_rate: '2.3%',
      secured: false,
      loan_restructured: false,
    };

    const authorizors: [Authorizor, Authorizor] = [
      {
        last_name: 'LastSenger',
        first_name: 'FirstSavannah',
        middle_name: null,
        prefix: null,
        suffix: null,
        date_signed: `${currentYear}-04-27`,
      },
      {
        last_name: 'Leannon',
        first_name: 'Gina',
        middle_name: null,
        prefix: null,
        suffix: null,
        date_signed: '2024-04-27',
        title: 'Legacy',
      },
    ];

    const loanAgreement = buildLoanAgreement(loanInfo, organization, authorizors, reportId);
    const loanReceipt = buildLoanReceipt(
      loanInfo.loan_amount,
      loanInfo.loan_incurred_date,
      organization,
      reportId,
    );
    const loanFromBank = buildLoanFromBank(loanInfo, organization, reportId, [
      loanAgreement,
      loanReceipt,
    ]);

    return makeTransaction(loanFromBank).then(() => result);
  });
}

export function setupLoanByCommittee(formData: LoanFormData = defaultLoanFormData) {
  return DataSetup({ individual: true, committee: true }).then((result: any) => {
    ReportListPage.goToReportList(result.report);
    StartTransaction.Loans().ByCommittee();
    PageUtils.urlCheck('LOAN_BY_COMMITTEE');
    ContactLookup.getCommittee(result.committee);
    TransactionDetailPage.enterLoanFormData({ ...formData, date_received: undefined });
    return cy.wrap(result, { log: false });
  });
}

export function setupLoanReceivedFromIndividual(formData: LoanFormData = defaultLoanFormData) {
  return DataSetup({ individual: true, individual2: true, committee: true }).then((result: any) => {
    ReportListPage.goToReportList(result.report);
    StartTransaction.Loans().Individual();
    PageUtils.urlCheck('LOAN_RECEIVED_FROM_INDIVIDUAL');
    ContactLookup.getContact(result.individual.last_name);
    TransactionDetailPage.enterLoanFormData({ ...formData, date_received: undefined });
    return cy.wrap(result, { log: false });
  });
}
