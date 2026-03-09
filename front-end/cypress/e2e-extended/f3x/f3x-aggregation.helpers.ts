/* eslint-disable @typescript-eslint/no-explicit-any */
import { currentYear, PageUtils } from '../../e2e-smoke/pages/pageUtils';
import { ReportListPage } from '../../e2e-smoke/pages/reportListPage';
import { StartTransaction } from '../../e2e-smoke/F3X/utils/start-transaction/start-transaction';
import { ContactLookup } from '../../e2e-smoke/pages/contactLookup';
import { TransactionDetailPage } from '../../e2e-smoke/pages/transactionDetailPage';
import { defaultDebtFormData, defaultScheduleFormData, DisbursementFormData } from '../../e2e-smoke/models/TransactionFormModel';
import { DataSetup } from '../../e2e-smoke/F3X/setup';
import { F3X, F3X_Q2 } from '../../e2e-smoke/requests/library/reports';
import { makeContact, makeF3x, makeTransaction } from '../../e2e-smoke/requests/methods';
import {
  Authorizor,
  buildContributionToCandidate,
  buildDebtOwedByCommittee,
  buildLoanAgreement,
  buildLoanFromBank,
  buildLoanReceipt,
  buildScheduleA,
  buildScheduleF,
  LoanInfo,
} from '../../e2e-smoke/requests/library/transactions';
import {
  Candidate_House_A,
  Candidate_Senate_A,
  Committee_A,
  Individual_A_A,
  MockContact,
  Organization_A,
} from '../../e2e-smoke/requests/library/contacts';

interface SeedEntry {
  amount: number;
  date: string;
  extra?: Record<string, unknown>;
}

interface ScheduleECreateArgs {
  reportId: string;
  payeeContactName: string;
  candidate: any;
  amount: number;
  disbursementDate: Date;
  disseminationDate?: Date;
  electionCode?: string;
}

const receiptsTableRoot = 'app-transaction-receipts p-table';
const disbursementsTableRoot = 'app-transaction-disbursements p-table';
const loansAndDebtsTableRoot = 'app-transaction-loans-and-debts p-table';

export class F3XAggregationHelpers {
  static readonly receiptsTableRoot = receiptsTableRoot;
  static readonly disbursementsTableRoot = disbursementsTableRoot;
  static readonly loansAndDebtsTableRoot = loansAndDebtsTableRoot;

  static readonly committeePrimaryId = 'c94c5d1a-9e73-464d-ad72-b73b5d8667a9';
  static readonly committeeSecondaryId = '7c176dc0-7062-49b5-bc35-58b4ef050d09';
  static readonly committeePtyId = '7c176dc0-7062-49b5-bc35-58b4ef050d08';
  static readonly rowActionButtonSelector = 'app-table-actions-button button[aria-label="action"]:visible';
  static readonly rowActionMenuButtonSelector = '.p-popover:visible .table-action-button:visible';
  static readonly confirmDialogSelector = 'app-confirm-dialog dialog[open]';
  static readonly confirmDialogSubmitSelector =
    'app-confirm-dialog dialog[open] button[data-cy="membership-submit"]';
  static readonly saveButtonSelector = 'button[data-cy="navigation-control-button"]';

  private static exactText(value: string): RegExp {
    return new RegExp(`^\\s*${Cypress._.escapeRegExp(value)}\\s*$`); // NOSONAR
  }

  private static suffix(): string {
    return `${Date.now()}-${Cypress._.random(1000, 9999)}`;
  }

  private static shortSuffix(): string {
    return `${Date.now().toString(36).slice(-4)}${Cypress._.random(0, 1295).toString(36).padStart(2, '0')}`;
  }

  private static boundedLabel(prefix: string, maxLength = 20): string {
    return `${prefix}${this.shortSuffix()}`.slice(0, maxLength);
  }

  private static assertTransactionId(transactionId: string, context: string): void {
    if (!transactionId || transactionId === 'undefined') {
      throw new Error(`${context} transaction id is missing`);
    }
  }

  private static getRequiredId(payload: any, context: string): string {
    const id = payload?.id as string | undefined;
    this.assertTransactionId(id ?? '', context);
    return id ?? '';
  }

  static transactionIdFromPayload(payload: unknown, context: string): string {
    const idFromString = typeof payload === 'string' ? payload : '';
    const idFromObject =
      payload && typeof payload === 'object' && 'id' in payload
        ? (payload as { id?: string }).id ?? ''
        : '';
    const transactionId = idFromString || idFromObject;
    this.assertTransactionId(transactionId, context);
    return transactionId;
  }

  private static normalizeTransactionPayload(payload: unknown, context: string): { id: string } & Record<string, any> {
    const id = this.transactionIdFromPayload(payload, context);
    if (payload && typeof payload === 'object') {
      return { ...(payload as Record<string, any>), id };
    }
    return { id };
  }

  static uniqueIndividualSeed(): MockContact {
    return {
      ...Individual_A_A,
      first_name: this.boundedLabel('Ind'),
      last_name: this.boundedLabel('Agg'),
    };
  }

  static uniqueOrganizationSeed(): MockContact {
    return {
      ...Organization_A,
      name: this.boundedLabel('Organization ', 32),
    };
  }

  static uniqueCommitteeSeed(): MockContact {
    return {
      ...Committee_A,
      committee_id: `C${String(Cypress._.random(0, 99999999)).padStart(8, '0')}`,
      name: `Committee ${this.suffix()}`,
    };
  }

  static uniqueHouseCandidateSeed(): MockContact {
    const numericSuffix = String(Cypress._.random(0, 99999)).padStart(5, '0');
    return {
      ...Candidate_House_A,
      candidate_id: `H1AK${numericSuffix}`,
      first_name: this.boundedLabel('House'),
      last_name: this.boundedLabel('Candidate'),
    };
  }

  static uniqueSenateCandidateSeed(): MockContact {
    const numericSuffix = String(Cypress._.random(0, 99999)).padStart(5, '0');
    return {
      ...Candidate_Senate_A,
      candidate_id: `S1AK${numericSuffix}`,
      first_name: this.boundedLabel('Senate'),
      last_name: this.boundedLabel('Candidate'),
    };
  }

  static setupWithContacts(setup: Parameters<typeof DataSetup>[0]): Cypress.Chainable<any> {
    return cy.then(() => DataSetup(setup));
  }

  static createContact(contact: MockContact): Cypress.Chainable<any> {
    return makeContact(contact).then((response) => {
      const created = response.body;
      this.getRequiredId(created, 'createContact');
      return created;
    });
  }

  static createReport(report: F3X = F3X_Q2): Cypress.Chainable<string> {
    return makeF3x(report).then((response) => {
      return this.getRequiredId(response.body, 'createReport');
    });
  }

  static deleteReport(reportId: string): Cypress.Chainable<number> {
    return cy.getCookie('csrftoken').then((cookie) => {
      return cy
        .request({
          method: 'DELETE',
          url: `http://localhost:8080/api/v1/reports/${reportId}/`,
          headers: {
            'x-csrftoken': cookie?.value,
          },
        })
        .its('status')
        .should('be.oneOf', [200, 202, 204]);
    });
  }

  static deleteTransactionById(transactionId: string): Cypress.Chainable<number> {
    this.assertTransactionId(transactionId, 'deleteTransactionById');
    return cy.getCookie('csrftoken').then((cookie) => {
      return cy
        .request({
          method: 'DELETE',
          url: `http://localhost:8080/api/v1/transactions/${transactionId}/`,
          headers: {
            'x-csrftoken': cookie?.value,
          },
        })
        .its('status')
        .should('be.oneOf', [200, 202, 204]);
    });
  }

  static listLoanRepaymentIdsForLoan(reportId: string, loanId: string): Cypress.Chainable<string[]> {
    this.assertTransactionId(loanId, 'listLoanRepaymentIdsForLoan');
    return cy
      .request({
        method: 'GET',
        url: 'http://localhost:8080/api/v1/transactions/',
        qs: {
          page: 1,
          page_size: 100,
          ordering: 'line_label,created',
          report_id: reportId,
        },
      })
      .then((response) => {
        const rows = Array.isArray(response.body?.results) ? response.body.results : [];
        return rows
          .filter(
            (transaction: any) =>
              transaction?.transaction_type_identifier === 'LOAN_REPAYMENT_MADE' &&
              transaction?.loan_id === loanId,
          )
          .map((transaction: any) => String(transaction.id))
          .filter((id: string) => !!id);
      });
  }

  static deleteTransactionsAndVerify404(transactionIds: string[]): Cypress.Chainable<void> {
    return cy
      .wrap(transactionIds)
      .each((transactionId) => {
        const id = String(transactionId);
        this.assertTransactionId(id, 'deleteTransactionsAndVerify404');
        return this.deleteTransactionById(id).then(() => {
          return cy
            .request({
              method: 'GET',
              url: `http://localhost:8080/api/v1/transactions/${id}/`,
              failOnStatusCode: false,
            })
            .then((response) => {
              expect(response.status).to.equal(404);
            });
        });
      })
      .then(() => undefined);
  }

  static createTransaction(payload: Record<string, any>): Cypress.Chainable<any> {
    return makeTransaction(payload).then((response) => {
      const created = this.normalizeTransactionPayload(response.body, 'createTransaction');
      return created;
    });
  }

  static getTransaction(transactionId: string): Cypress.Chainable<any> {
    this.assertTransactionId(transactionId, 'getTransaction');
    return cy.request({
      method: 'GET',
      url: `http://localhost:8080/api/v1/transactions/${transactionId}/`,
    }).its('body');
  }

  static readLoanBalanceValueByApi(loanId: string): Cypress.Chainable<number> {
    this.assertTransactionId(loanId, 'readLoanBalanceValueByApi');
    return this.getTransaction(loanId).then((transaction) => {
      const rawBalance = transaction?.loan_balance ?? transaction?.balance;
      const parsedBalance =
        typeof rawBalance === 'number' ? rawBalance : Number(String(rawBalance ?? '').replaceAll(/[^0-9.-]/g, ''));

      if (Number.isNaN(parsedBalance)) {
        throw new TypeError(`readLoanBalanceValueByApi unable to parse loan balance for transaction ${loanId}`);
      }

      return parsedBalance;
    });
  }

  static waitForLoanBalanceRestoreByApi(
    loanId: string,
    expectedBalance: number,
    options: { maxAttempts?: number; intervalMs?: number } = {},
  ): Cypress.Chainable<void> {
    this.assertTransactionId(loanId, 'waitForLoanBalanceRestoreByApi');
    const maxAttempts = options.maxAttempts ?? 8;
    const intervalMs = options.intervalMs ?? 500;

    const poll = (attempt: number): Cypress.Chainable<void> => {
      return this.readLoanBalanceValueByApi(loanId).then((actualBalance) => {
        cy.log(
          `C1-C5 strict poll ${attempt + 1}/${maxAttempts + 1}: loanId=${loanId}, actual=${actualBalance}, expected=${expectedBalance}`,
        );
        if (actualBalance === expectedBalance) {
          cy.log(`C1-C5 strict poll resolved: loanId=${loanId}, restored_balance=${actualBalance}`);
          return;
        }

        if (attempt >= maxAttempts) {
          cy.log(
            `C1-C5 strict poll exhausted: loanId=${loanId}, final_actual=${actualBalance}, expected=${expectedBalance}`,
          );
          expect(
            actualBalance,
            `Loan balance restore via API after repayment delete (attempt ${attempt + 1}/${maxAttempts + 1})`,
          ).to.equal(expectedBalance);
          return;
        }

        return cy.wait(intervalMs).then(() => poll(attempt + 1));
      });
    };

    return poll(0);
  }

  static updateTransaction(transactionId: string, payload: Record<string, any>): Cypress.Chainable<any> {
    this.assertTransactionId(transactionId, 'updateTransaction');
    return cy.getCookie('csrftoken').then((cookie) => {
      return cy
        .request({
          // API blocks partial_update (PATCH) on this endpoint, so tests must use full update semantics.
          method: 'PUT',
          url: `http://localhost:8080/api/v1/transactions/${transactionId}/`,
          body: payload,
          headers: {
            'x-csrftoken': cookie?.value,
          },
        })
        .its('body');
    });
  }

  static seedScheduleAChain(reportId: string, contact: any, entries: SeedEntry[]): Cypress.Chainable<string[]> {
    const transactionIds: string[] = [];
    let chain: Cypress.Chainable<any> = cy.wrap(null);
    entries.forEach((entry) => {
      chain = chain.then(() => {
        return this.createTransaction(
          buildScheduleA('INDIVIDUAL_RECEIPT', entry.amount, entry.date, contact, reportId, entry.extra),
        ).then((created) => {
          transactionIds.push(created.id);
        });
      });
    });
    return chain.then(() => transactionIds);
  }

  static seedScheduleBChain(
    reportId: string,
    payee: any,
    candidate: any,
    entries: SeedEntry[],
  ): Cypress.Chainable<string[]> {
    const transactionIds: string[] = [];
    let chain: Cypress.Chainable<any> = cy.wrap(null);
    entries.forEach((entry) => {
      chain = chain.then(() => {
        return this.createTransaction(
          buildContributionToCandidate(entry.amount, entry.date, [payee, candidate], reportId, {
            election_code: `P${currentYear}`,
            support_oppose_code: 'S',
            date_signed: `${currentYear}-04-10`,
            ...entry.extra,
          }),
        ).then((created) => {
          transactionIds.push(created.id);
        });
      });
    });
    return chain.then(() => transactionIds);
  }

  static seedScheduleFChain(
    reportId: string,
    payee: any,
    candidate: any,
    committee: any,
    entries: SeedEntry[],
  ): Cypress.Chainable<string[]> {
    const transactionIds: string[] = [];
    let chain: Cypress.Chainable<any> = cy.wrap(null);
    entries.forEach((entry) => {
      chain = chain.then(() => {
        return this.createTransaction(
          buildScheduleF(entry.amount, entry.date, payee, candidate, committee, reportId, entry.extra),
        ).then((created) => {
          transactionIds.push(created.id);
        });
      });
    });
    return chain.then(() => transactionIds);
  }

  static seedDebtToCommittee(
    reportId: string,
    committeeContact: any,
    debtPurpose: string,
    amount: number,
  ): Cypress.Chainable<string> {
    return this.createTransaction(buildDebtOwedByCommittee(committeeContact, reportId, debtPurpose, amount)).then((created) => {
      return created.id;
    });
  }

  static seedLoanFromBank(reportId: string, organization: any): Cypress.Chainable<string> {
    const loanInfo: LoanInfo = {
      loan_amount: 6000,
      loan_incurred_date: `${currentYear}-04-12`,
      loan_due_date: `${currentYear}-08-01`,
      loan_interest_rate: '2.1%',
      secured: false,
      loan_restructured: false,
    };

    const authorizors: [Authorizor, Authorizor] = [
      {
        last_name: 'Treasurer',
        first_name: 'Taylor',
        middle_name: null,
        prefix: null,
        suffix: null,
        date_signed: `${currentYear}-04-12`,
      },
      {
        last_name: 'Banker',
        first_name: 'Jamie',
        middle_name: null,
        prefix: null,
        suffix: null,
        title: 'Manager',
        date_signed: `${currentYear}-04-12`,
      },
    ];

    const agreement = buildLoanAgreement(loanInfo, organization, authorizors, reportId);
    const receipt = buildLoanReceipt(loanInfo.loan_amount, loanInfo.loan_incurred_date, organization, reportId);
    const payload = buildLoanFromBank(loanInfo, organization, reportId, [agreement, receipt]);
    return this.createTransaction(payload).then((created) => created.id);
  }

  static createIndependentExpenditureViaUI(args: ScheduleECreateArgs): Cypress.Chainable<string> {
    let createdId = '';
    const disbursementDate = args.disbursementDate;
    const disseminationDate = args.disseminationDate ?? args.disbursementDate;
    const electionTypeFromCode = args.electionCode?.slice(0, 1) ?? '';
    const parsedElectionYear = args.electionCode ? Number(args.electionCode.slice(1)) : Number.NaN;
    const electionYearFromCode = Number.isNaN(parsedElectionYear) ? currentYear : parsedElectionYear;
    this.goToReport(args.reportId);
    StartTransaction.Disbursements().Contributions().IndependentExpenditure();
    ContactLookup.getContact(args.payeeContactName, '', 'Individual');

    cy.intercept({
      method: 'POST',
      pathname: '/api/v1/transactions/',
    }).as('CreateScheduleETransaction');

    const formData: DisbursementFormData = {
      ...defaultScheduleFormData,
      amount: args.amount,
      date_received: disbursementDate,
      date2: disseminationDate,
      supportOpposeCode: 'SUPPORT',
      electionType: electionTypeFromCode || 'G',
      electionYear: electionYearFromCode,
      signatoryDateSigned: disbursementDate,
      signatoryFirstName: this.boundedLabel('Sig'),
      signatoryLastName: this.boundedLabel('Sig'),
    };

    TransactionDetailPage.enterSheduleFormDataForVoidExpenditure(formData, args.candidate, false, '', 'date_signed');
    this.clearAndType('#electionYear', `${electionYearFromCode}`);
    PageUtils.blurActiveField();
    this.clickSave();

    cy.wait('@CreateScheduleETransaction').then((interception) => {
      expect(interception.response?.statusCode, 'CreateScheduleETransaction status').to.be.oneOf([200, 201]);
      createdId = this.transactionIdFromPayload(interception.response?.body, 'createIndependentExpenditureViaUI');
    });
    cy.contains('Transactions in this report').should('exist');
    return cy.then(() => createdId);
  }

  static createIndependentExpenditureSeries(args: ScheduleECreateArgs[]): Cypress.Chainable<string[]> {
    const createdIds: string[] = [];
    let chain: Cypress.Chainable<unknown> = cy.wrap(null, { log: false });

    args.forEach((entry) => {
      chain = chain.then(() => {
        return this.createIndependentExpenditureViaUI(entry).then((createdId) => {
          createdIds.push(createdId);
        });
      });
    });

    return chain.then(() => createdIds);
  }

  static createDebtToCommitteeWithReceiptRepayment(args: {
    reportId: string;
    committee: any;
    individual: any;
    debtAmount: number;
    repaymentAmount: number;
    repaymentDate: Date;
    debtContextLabel: string;
    repaymentContextLabel: string;
  }): Cypress.Chainable<{ debtId: string; repaymentId: string }> {
    this.goToReport(args.reportId);
    StartTransaction.Debts().ToCommittee();
    ContactLookup.getCommittee(args.committee);

    cy.intercept({
      method: 'POST',
      pathname: '/api/v1/transactions/',
    }).as('CreateDebtTransaction');

    TransactionDetailPage.enterLoanFormData(
      {
        ...defaultDebtFormData,
        amount: args.debtAmount,
      },
      false,
      '',
      '#amount',
    );
    PageUtils.clickButton('Save');

    return cy.wait('@CreateDebtTransaction').then((interception) => {
      const debtId = this.transactionIdFromPayload(interception.response?.body, args.debtContextLabel);

      this.goToReport(args.reportId);
      this.openDebtRepaymentSelection(debtId);
      this.reportDebtRepaymentAsReceipt();
      ContactLookup.getContact(args.individual.last_name);

      cy.intercept({
        method: 'POST',
        pathname: '/api/v1/transactions/',
      }).as('CreateDebtRepaymentReceipt');

      TransactionDetailPage.enterScheduleFormData(
        {
          ...defaultScheduleFormData,
          electionType: undefined,
          electionYear: undefined,
          date_received: args.repaymentDate,
          amount: args.repaymentAmount,
        },
        false,
        '',
        true,
        'contribution_date',
      );
      PageUtils.clickButton('Save');

      return cy.wait('@CreateDebtRepaymentReceipt').then((repaymentInterception) => {
        const repaymentId = this.transactionIdFromPayload(
          repaymentInterception.response?.body,
          args.repaymentContextLabel,
        );

        return { debtId, repaymentId };
      });
    });
  }

  static interceptDeleteTransaction(alias = 'DeleteTransaction'): void {
    cy.intercept({
      method: 'DELETE',
      pathname: /\/api\/v1\/transactions\/[^/]+\/$/,
    }).as(alias);
  }

  static interceptUpdateItemizationAggregation(alias = 'UpdateItemizationAggregation'): void {
    cy.intercept({
      method: 'PUT',
      pathname: /\/api\/v1\/transactions\/[^/]+\/update-itemization-aggregation\/$/,
    }).as(alias);
  }

  static waitAlias(alias: string): void {
    cy.wait(`@${alias}`);
  }

  static goToReport(reportId: string): void {
    ReportListPage.goToReportList(reportId);
    cy.contains('Transactions in this report').should('exist');
  }

  static reloadReport(reportId: string): void {
    this.goToReport(reportId);
  }

  static switchCommittee(committeeId: string): void {
    PageUtils.switchCommittee(committeeId);
  }

  static rowLinkById(tableRoot: string, transactionId: string): Cypress.Chainable<JQuery<HTMLElement>> {
    this.assertTransactionId(transactionId, 'rowLinkById');
    return cy.get(`${tableRoot} a[href*="/list/${transactionId}"]`).first().should('exist');
  }

  static rowById(tableRoot: string, transactionId: string): Cypress.Chainable<JQuery<HTMLTableRowElement>> {
    return this.rowLinkById(tableRoot, transactionId).closest('tr').should('exist');
  }

  static openRowById(tableRoot: string, transactionId: string): void {
    this.rowLinkById(tableRoot, transactionId).click();
  }

  static clickRowActionById(tableRoot: string, transactionId: string, actionLabel: string): void {
    this.rowById(tableRoot, transactionId).within(() => {
      cy.get(this.rowActionButtonSelector).first().click();
    });
    cy.get(this.rowActionMenuButtonSelector)
      .filter((_, button) => this.exactText(actionLabel).test(button.textContent ?? ''))
      .should('have.length', 1)
      .first()
      .click();
  }

  static clickRowActionByCellText(tableRoot: string, cellText: string, actionLabel: string): void {
    cy.get(tableRoot)
      .contains('td', this.exactText(cellText))
      .first()
      .closest('tr')
      .within(() => {
        cy.get(this.rowActionButtonSelector).should('have.length', 1).first().click();
      });

    cy.get(this.rowActionMenuButtonSelector)
      .filter((_, button) => this.exactText(actionLabel).test(button.textContent ?? ''))
      .should('have.length', 1)
      .first()
      .click();
  }

  static confirmDialog(): void {
    cy.get(this.confirmDialogSelector).should('exist');
    cy.get(this.confirmDialogSubmitSelector).contains(this.exactText('Confirm')).click();
    cy.get(this.confirmDialogSelector).should('not.exist');
  }

  static clickSave(): void {
    cy.get('body').then(($body) => {
      if ($body.find('.p-datepicker-panel:visible').length > 0) {
        cy.get('body').type('{esc}');
      }
    });
    PageUtils.blurActiveField();
    cy.get(`${this.saveButtonSelector}:visible:not([disabled])`)
      .filter((_, button) => this.exactText('Save').test(button.textContent ?? ''))
      .should('have.length.at.least', 1)
      .last()
      .click();
  }

  static assertRowStatus(
    tableRoot: string,
    transactionId: string,
    statusLabel: 'Unitemized' | 'Unaggregated',
    present: boolean,
  ): void {
    this.assertTransactionId(transactionId, 'assertRowStatus');
    cy.get(tableRoot).should(($table) => {
      const rowLink = $table.find(`a[href*="/list/${transactionId}"]`).first();
      expect(rowLink.length, `row link for ${transactionId}`).to.equal(1);
      const statusCellText = rowLink.closest('tr').find('td').eq(1).text();

      if (present) {
        expect(statusCellText).to.contain(statusLabel);
      } else {
        expect(statusCellText).not.to.contain(statusLabel);
      }
    });
  }

  static assertReceiptAggregate(transactionId: string, expected: string): void {
    this.rowById(this.receiptsTableRoot, transactionId).find('td').eq(6).should('contain', expected);
  }

  static assertReceiptRowStatus(transactionId: string, statusLabel: 'Unitemized' | 'Unaggregated', present: boolean): void {
    this.assertRowStatus(this.receiptsTableRoot, transactionId, statusLabel, present);
  }

  static assertDisbursementAmount(transactionId: string, expected: string): void {
    this.rowById(this.disbursementsTableRoot, transactionId).find('td').eq(5).should('contain', expected);
  }

  static assertLoansBalance(transactionId: string, expected: string): void {
    this.rowById(this.loansAndDebtsTableRoot, transactionId).find('td').eq(5).should('contain', expected);
  }

  static assertAggregateField(expected: string): void {
    cy.get('#aggregate').should('have.value', expected);
  }

  static assertCalendarYtdField(expected: string): void {
    cy.get('#calendar_ytd').should('have.value', expected);
  }

  static assertScheduleFAggregateField(expected: string): void {
    cy.get('#aggregate_general_elec_expended').should('have.value', expected);
  }

  static assertDebtBalanceAtCloseField(expected: string): void {
    cy.get('#balance_at_close').should('have.value', expected);
  }

  static assertLoanBalanceFields(expectedBalance: string, expectedPaymentToDate: string): void {
    cy.get('#balance').should('have.value', expectedBalance);
    cy.get('#payment_amount').should('have.value', expectedPaymentToDate);
  }

  static deleteRowById(tableRoot: string, transactionId: string): void {
    this.assertTransactionId(transactionId, 'deleteRowById');
    this.interceptDeleteTransaction();
    this.clickRowActionById(tableRoot, transactionId, 'Delete');
    this.confirmDialog();
    this.waitAlias('DeleteTransaction');
    cy.get(`${tableRoot} a[href*="/list/${transactionId}"]`).should('not.exist');
  }

  static itemizeRowById(tableRoot: string, transactionId: string): void {
    this.interceptUpdateItemizationAggregation();
    this.clickRowActionById(tableRoot, transactionId, 'Itemize');
    this.confirmDialog();
    this.waitAlias('UpdateItemizationAggregation');
  }

  static unitemizeRowById(tableRoot: string, transactionId: string): void {
    this.interceptUpdateItemizationAggregation();
    this.clickRowActionById(tableRoot, transactionId, 'Unitemize');
    this.confirmDialog();
    this.waitAlias('UpdateItemizationAggregation');
  }

  static aggregateRowById(tableRoot: string, transactionId: string): void {
    this.interceptUpdateItemizationAggregation();
    this.clickRowActionById(tableRoot, transactionId, 'Aggregate');
    this.waitAlias('UpdateItemizationAggregation');
  }

  static unaggregateRowById(tableRoot: string, transactionId: string): void {
    this.interceptUpdateItemizationAggregation();
    this.clickRowActionById(tableRoot, transactionId, 'Unaggregate');
    this.waitAlias('UpdateItemizationAggregation');
  }

  static assertDialogTitle(title: string): void {
    cy.get(this.confirmDialogSelector).contains(this.exactText(title)).should('exist');
  }

  static clickConfirmDialogContinue(): void {
    cy.get(this.confirmDialogSubmitSelector).contains(this.exactText('Continue')).click();
  }

  static clearAndType(selector: string, value: string): void {
    cy.get(selector).clear().safeType(value).blur();
  }

  static assertReceiptTransactionAbsent(transactionId: string): void {
    this.assertTransactionId(transactionId, 'assertReceiptTransactionAbsent');
    cy.get(`${this.receiptsTableRoot} a[href*="/list/${transactionId}"]`).should('not.exist');
  }

  static assertDisbursementTransactionAbsent(transactionId: string): void {
    this.assertTransactionId(transactionId, 'assertDisbursementTransactionAbsent');
    cy.get(`${this.disbursementsTableRoot} a[href*="/list/${transactionId}"]`).should('not.exist');
  }

  static assertLoanOrDebtTransactionAbsent(transactionId: string): void {
    this.assertTransactionId(transactionId, 'assertLoanOrDebtTransactionAbsent');
    cy.get(`${this.loansAndDebtsTableRoot} a[href*="/list/${transactionId}"]`).should('not.exist');
  }

  static openDebtRepaymentSelection(debtId: string): void {
    this.clickRowActionById(this.loansAndDebtsTableRoot, debtId, 'Report debt repayment');
    PageUtils.urlCheck('select/receipt?debt=');
  }

  static openDebtDisbursementRepaymentSelection(debtId: string): void {
    this.clickRowActionById(this.loansAndDebtsTableRoot, debtId, 'Report debt repayment');
    PageUtils.urlCheck('select/disbursement?debt=');
  }

  static openLoanRepaymentSelection(loanId: string): void {
    this.clickRowActionById(this.loansAndDebtsTableRoot, loanId, 'Make loan repayment');
    PageUtils.urlCheck('create/LOAN_REPAYMENT_MADE?loan=');
  }

  static reportDebtRepaymentAsReceipt(): void {
    PageUtils.clickAccordion('CONTRIBUTIONS FROM INDIVIDUALS/PERSONS');
    PageUtils.clickLink('Individual Receipt');
  }

  static openLoanAgreement(loanId: string): void {
    this.clickRowActionById(this.loansAndDebtsTableRoot, loanId, 'Review loan agreement');
  }

  static openCreateLoanAgreement(loanId: string): void {
    this.clickRowActionById(this.loansAndDebtsTableRoot, loanId, 'New loan agreement');
  }

  static assertConfirmDialogOpen(): void {
    cy.get(this.confirmDialogSelector).should('exist');
  }

  static assertConfirmDialogClosed(): void {
    cy.get(this.confirmDialogSelector).should('not.exist');
  }

  static clickConfirmDialogConfirm(): void {
    cy.get(this.confirmDialogSubmitSelector).contains(this.exactText('Confirm')).click();
  }

  static clickConfirmDialogCancel(): void {
    cy.get(this.confirmDialogSelector).contains('button', this.exactText('Cancel')).click();
  }

  static assertReceiptLineAmount(transactionId: string, expected: string): void {
    this.rowById(this.receiptsTableRoot, transactionId).find('td').eq(5).should('contain', expected);
  }

  static assertDisbursementRowStatus(
    transactionId: string,
    statusLabel: 'Unitemized' | 'Unaggregated',
    present: boolean,
  ): void {
    this.assertRowStatus(this.disbursementsTableRoot, transactionId, statusLabel, present);
  }

  static assertLoanOrDebtRowStatus(transactionId: string, statusLabel: 'Unitemized', present: boolean): void {
    this.assertRowStatus(this.loansAndDebtsTableRoot, transactionId, statusLabel, present);
  }

  static assertReceiptListLoaded(): void {
    cy.get(this.receiptsTableRoot).should('exist');
  }

  static assertDisbursementListLoaded(): void {
    cy.get(this.disbursementsTableRoot).should('exist');
  }

  static assertLoanAndDebtListLoaded(): void {
    cy.get(this.loansAndDebtsTableRoot).should('exist');
  }

  static assertCurrentPathIncludes(pathPart: string): void {
    cy.location('pathname').should('include', pathPart);
  }

  static assertVisibleTextInRow(tableRoot: string, transactionId: string, expected: string): void {
    this.rowById(tableRoot, transactionId).should('contain', expected);
  }

  static assertNotVisibleTextInRow(tableRoot: string, transactionId: string, expected: string): void {
    this.rowById(tableRoot, transactionId).should('not.contain', expected);
  }

  static clickTableActionWithoutConfirm(tableRoot: string, transactionId: string, actionLabel: string): void {
    this.clickRowActionById(tableRoot, transactionId, actionLabel);
  }

  static assertRowExists(tableRoot: string, transactionId: string): void {
    this.rowById(tableRoot, transactionId).should('exist');
  }

  static assertRowNotExists(tableRoot: string, transactionId: string): void {
    this.assertTransactionId(transactionId, 'assertRowNotExists');
    cy.get(`${tableRoot} a[href*="/list/${transactionId}"]`).should('not.exist');
  }

  static assertReceiptAggregateFieldOnOpen(transactionId: string, expected: string): void {
    this.openRowById(this.receiptsTableRoot, transactionId);
    this.assertAggregateField(expected);
  }

  static assertCalendarYtdFieldOnOpen(transactionId: string, expected: string): void {
    this.openDisbursement(transactionId);
    this.assertCalendarYtdField(expected);
  }

  static assertScheduleEAggregateFieldOnOpen(transactionId: string, expected: string): void {
    this.assertCalendarYtdFieldOnOpen(transactionId, expected);
  }

  static assertScheduleFAggregateFieldOnOpen(transactionId: string, expected: string): void {
    this.openRowById(this.disbursementsTableRoot, transactionId);
    this.assertScheduleFAggregateField(expected);
  }

  static assertDebtBalanceFieldOnOpen(transactionId: string, expected: string): void {
    this.openRowById(this.loansAndDebtsTableRoot, transactionId);
    this.assertDebtBalanceAtCloseField(expected);
  }

  static assertLoanFieldsOnOpen(transactionId: string, expectedBalance: string, expectedPaymentToDate: string): void {
    this.openRowById(this.loansAndDebtsTableRoot, transactionId);
    this.assertLoanBalanceFields(expectedBalance, expectedPaymentToDate);
  }

  static assertReceiptRowCount(expectedCount: number): void {
    cy.get(`${this.receiptsTableRoot} tbody tr`).should('have.length', expectedCount);
  }

  static assertDisbursementRowCount(expectedCount: number): void {
    cy.get(`${this.disbursementsTableRoot} tbody tr`).should('have.length', expectedCount);
  }

  static assertLoanAndDebtRowCount(expectedCount: number): void {
    cy.get(`${this.loansAndDebtsTableRoot} tbody tr`).should('have.length', expectedCount);
  }

  static assertStatusPersistsAfterReload(
    reportId: string,
    tableRoot: string,
    transactionId: string,
    statusLabel: 'Unitemized' | 'Unaggregated',
    expected: boolean,
  ): void {
    this.reloadReport(reportId);
    this.assertRowStatus(tableRoot, transactionId, statusLabel, expected);
  }

  static waitForTransactionsRefresh(reportId: string): void {
    this.goToReport(reportId);
  }

  static assertDialogMessageContains(expected: string): void {
    cy.get(this.confirmDialogSelector).should('contain', expected);
  }

  static assertReceiptAggregateAfterOpenAndBack(transactionId: string, expected: string): void {
    this.openRowById(this.receiptsTableRoot, transactionId);
    this.assertAggregateField(expected);
    this.clickSave();
    cy.contains('Transactions in this report').should('exist');
  }

  static assertScheduleEAggregateAfterOpenAndBack(transactionId: string, expected: string): void {
    this.openRowById(this.disbursementsTableRoot, transactionId);
    this.assertCalendarYtdField(expected);
    this.clickSave();
    cy.contains('Transactions in this report').should('exist');
  }

  static assertScheduleFAggregateAfterOpenAndBack(transactionId: string, expected: string): void {
    this.openRowById(this.disbursementsTableRoot, transactionId);
    this.assertScheduleFAggregateField(expected);
    this.clickSave();
    cy.contains('Transactions in this report').should('exist');
  }

  static assertDebtBalanceAfterOpenAndBack(transactionId: string, expected: string): void {
    this.openRowById(this.loansAndDebtsTableRoot, transactionId);
    this.assertDebtBalanceAtCloseField(expected);
    this.clickSave();
    cy.contains('Transactions in this report').should('exist');
  }

  static assertLoanFieldsAfterOpenAndBack(transactionId: string, expectedBalance: string, expectedPaymentToDate: string): void {
    this.openRowById(this.loansAndDebtsTableRoot, transactionId);
    this.assertLoanBalanceFields(expectedBalance, expectedPaymentToDate);
    this.clickSave();
    cy.contains('Transactions in this report').should('exist');
  }

  static assertHasOpenConfirmDialog(): void {
    cy.get(this.confirmDialogSelector).should('exist');
  }

  static assertHasNoOpenConfirmDialog(): void {
    cy.get(this.confirmDialogSelector).should('not.exist');
  }

  static assertReceiptName(transactionId: string, expected: string): void {
    this.rowById(this.receiptsTableRoot, transactionId).find('td').eq(2).should('contain', expected);
  }

  static assertDisbursementName(transactionId: string, expected: string): void {
    this.rowById(this.disbursementsTableRoot, transactionId).find('td').eq(2).should('contain', expected);
  }

  static assertLoanOrDebtName(transactionId: string, expected: string): void {
    this.rowById(this.loansAndDebtsTableRoot, transactionId).find('td').eq(2).should('contain', expected);
  }

  static assertAggregateInOpenReceiptForm(expected: string): void {
    this.assertAggregateField(expected);
  }

  static assertCalendarYtdInOpenDisbursementForm(expected: string): void {
    this.assertCalendarYtdField(expected);
  }

  static assertScheduleFAggregateInOpenDisbursementForm(expected: string): void {
    this.assertScheduleFAggregateField(expected);
  }

  static assertDebtBalanceInOpenLoanDebtForm(expected: string): void {
    this.assertDebtBalanceAtCloseField(expected);
  }

  static assertLoanBalanceInOpenLoanDebtForm(expectedBalance: string, expectedPaymentToDate: string): void {
    this.assertLoanBalanceFields(expectedBalance, expectedPaymentToDate);
  }

  static openReceipt(transactionId: string): void {
    this.openRowById(this.receiptsTableRoot, transactionId);
  }

  static openDisbursement(transactionId: string): void {
    this.openRowById(this.disbursementsTableRoot, transactionId);
  }

  static openLoanOrDebt(transactionId: string): void {
    this.openRowById(this.loansAndDebtsTableRoot, transactionId);
  }

  static saveAndReturnToList(): void {
    this.clickSave();
    cy.contains('Transactions in this report').should('exist');
  }

  static cancelAndReturnToList(): void {
    PageUtils.clickButton('Cancel');
    cy.contains('Transactions in this report').should('exist');
  }

  static assertRouteContains(fragment: string): void {
    cy.url().should('include', fragment);
  }

  static assertVisibleInList(tableRoot: string, transactionId: string): void {
    this.rowLinkById(tableRoot, transactionId).should('exist');
  }

  static assertHiddenInList(tableRoot: string, transactionId: string): void {
    this.assertTransactionId(transactionId, 'assertHiddenInList');
    cy.get(`${tableRoot} a[href*="/list/${transactionId}"]`).should('not.exist');
  }

  static assertReceiptAmount(transactionId: string, expected: string): void {
    this.assertReceiptLineAmount(transactionId, expected);
  }

  static assertReceiptMemoCode(transactionId: string, expected: string): void {
    this.rowById(this.receiptsTableRoot, transactionId).find('td').eq(4).should('contain', expected);
  }

  static assertDisbursementMemoCode(transactionId: string, expected: string): void {
    this.rowById(this.disbursementsTableRoot, transactionId).find('td').eq(4).should('contain', expected);
  }

  static assertLoanOrDebtAmount(transactionId: string, expected: string): void {
    this.rowById(this.loansAndDebtsTableRoot, transactionId).find('td').eq(4).should('contain', expected);
  }

  static assertReceiptDate(transactionId: string, expected: string): void {
    this.rowById(this.receiptsTableRoot, transactionId).find('td').eq(3).should('contain', expected);
  }

  static assertDisbursementDate(transactionId: string, expected: string): void {
    this.rowById(this.disbursementsTableRoot, transactionId).find('td').eq(3).should('contain', expected);
  }

  static assertLoanOrDebtIncurredDate(transactionId: string, expected: string): void {
    this.rowById(this.loansAndDebtsTableRoot, transactionId).find('td').eq(3).should('contain', expected);
  }

  static assertActionExists(tableRoot: string, transactionId: string, actionLabel: string): void {
    this.rowById(tableRoot, transactionId).within(() => {
      cy.get(this.rowActionButtonSelector).first().click();
    });
    cy.get(this.rowActionMenuButtonSelector)
      .filter((_, button) => this.exactText(actionLabel).test(button.textContent ?? ''))
      .should('have.length', 1)
      .first()
      .should('be.visible');
  }

  static assertActionDoesNotExist(tableRoot: string, transactionId: string, actionLabel: string): void {
    this.rowById(tableRoot, transactionId).within(() => {
      cy.get(this.rowActionButtonSelector).first().click();
    });
    cy.get(this.rowActionMenuButtonSelector)
      .filter((_, button) => this.exactText(actionLabel).test(button.textContent ?? ''))
      .should('have.length', 0);
    cy.get('body').type('{esc}');
  }

  static assertRowCellContains(tableRoot: string, transactionId: string, cellIndex: number, expected: string): void {
    this.rowById(tableRoot, transactionId).find('td').eq(cellIndex).should('contain', expected);
  }

  static assertRowCellNotContains(tableRoot: string, transactionId: string, cellIndex: number, expected: string): void {
    this.rowById(tableRoot, transactionId).find('td').eq(cellIndex).should('not.contain', expected);
  }

  static assertActionButtonPresent(tableRoot: string, transactionId: string): void {
    this.rowById(tableRoot, transactionId).within(() => {
      cy.get(this.rowActionButtonSelector).should('exist');
    });
  }

}
