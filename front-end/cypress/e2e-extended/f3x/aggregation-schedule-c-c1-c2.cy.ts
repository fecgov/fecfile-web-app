/* eslint-disable @typescript-eslint/no-explicit-any */
import { Initialize } from '../../e2e-smoke/pages/loginPage';
import { currentYear, PageUtils } from '../../e2e-smoke/pages/pageUtils';
import { TransactionDetailPage } from '../../e2e-smoke/pages/transactionDetailPage';
import { ContactLookup } from '../../e2e-smoke/pages/contactLookup';
import { ReportListPage } from '../../e2e-smoke/pages/reportListPage';
import { DataSetup } from '../../e2e-smoke/F3X/setup';
import { StartTransaction } from '../../e2e-smoke/F3X/utils/start-transaction/start-transaction';
import { defaultLoanFormData } from '../../e2e-smoke/models/TransactionFormModel';
import { F3XAggregationHelpers } from './f3x-aggregation.helpers';

function parseCurrency(value: string): number {
  return Number((value || '').replace(/[^0-9.-]/g, ''));
}

function readLoanBalanceValueInList(loanId: string): Cypress.Chainable<number> {
  return F3XAggregationHelpers.rowById(F3XAggregationHelpers.loansAndDebtsTableRoot, loanId)
    .find('td')
    .eq(5)
    .invoke('text')
    .then((text) => {
      return parseCurrency(text);
    });
}

function assertLoanBalanceValueInList(loanId: string, expected: number): void {
  readLoanBalanceValueInList(loanId).then((actual) => {
    expect(actual).to.equal(expected);
  });
}

function executeLoanRepaymentLifecycleWithIntegrity(
  reportId: string,
  loanId: string,
  assertBalanceRestore: boolean,
): void {
  let initialBalance = 0;
  F3XAggregationHelpers.goToReport(reportId);
  readLoanBalanceValueInList(loanId).then((balance) => {
    initialBalance = balance;
    expect(initialBalance).to.be.greaterThan(0);
  });

  F3XAggregationHelpers.listLoanRepaymentIdsForLoan(reportId, loanId).then((repaymentIdsBeforeCreate) => {
    F3XAggregationHelpers.clickRowActionById(
      F3XAggregationHelpers.loansAndDebtsTableRoot,
      loanId,
      'Make loan repayment',
    );
    PageUtils.urlCheck('LOAN_REPAYMENT_MADE?loan=');

    cy.intercept(
      {
        method: 'POST',
        pathname: '/api/v1/transactions/',
      },
      (req) => {
        if (req.body?.transaction_type_identifier === 'LOAN_REPAYMENT_MADE') {
          req.alias = 'CreateLoanRepayment';
        }
      },
    );

    TransactionDetailPage.enterDate('[data-cy="expenditure_date"]', new Date(currentYear, 4 - 1, 25));
    cy.get('#amount').safeType(1000);
    PageUtils.clickButton('Save');

    cy.wait('@CreateLoanRepayment');
    F3XAggregationHelpers.goToReport(reportId);
    assertLoanBalanceValueInList(loanId, initialBalance - 1000);

    F3XAggregationHelpers.listLoanRepaymentIdsForLoan(reportId, loanId).then((repaymentIdsAfterCreate) => {
      const createdRepaymentIds = repaymentIdsAfterCreate.filter((id) => !repaymentIdsBeforeCreate.includes(id));
      expect(createdRepaymentIds.length, 'C1-C5 created repayment ids after save').to.be.greaterThan(0);
      cy.log(`C1-C5 guard: using API delete for repayment ids ${createdRepaymentIds.join(', ')}`);

      F3XAggregationHelpers.deleteTransactionsAndVerify404(createdRepaymentIds)
        .then(() => {
          return F3XAggregationHelpers.listLoanRepaymentIdsForLoan(reportId, loanId).then((repaymentIdsAfterDelete) => {
            const sortedBefore = [...repaymentIdsBeforeCreate].sort();
            const sortedAfterDelete = [...repaymentIdsAfterDelete].sort();
            expect(
              sortedAfterDelete,
              'C1-C5 repayment ids after delete should return to pre-create baseline',
            ).to.deep.equal(sortedBefore);
          });
        })
        .then(() => {
          if (assertBalanceRestore) {
            return F3XAggregationHelpers.getTransaction(loanId)
              .then((loanAfterDelete) => {
                expect(
                  loanAfterDelete,
                  'C1-C5 strict diagnostic: parent loan payload should include loan_payment_to_date',
                ).to.have.property('loan_payment_to_date');
                expect(
                  loanAfterDelete,
                  'C1-C5 strict diagnostic: parent loan payload should include loan_balance',
                ).to.have.property('loan_balance');

                const loanPaymentToDate = parseCurrency(String(loanAfterDelete.loan_payment_to_date ?? ''));
                const loanBalance = parseCurrency(String(loanAfterDelete.loan_balance ?? ''));
                expect(Number.isNaN(loanPaymentToDate), 'C1-C5 strict diagnostic loan_payment_to_date parse').to.equal(false);
                expect(Number.isNaN(loanBalance), 'C1-C5 strict diagnostic loan_balance parse').to.equal(false);
                cy.log(
                  `C1-C5 strict diagnostic after repayment delete: loan_payment_to_date=${loanPaymentToDate}, loan_balance=${loanBalance}`,
                );
              })
              .then(() => {
                cy.log(`C1-C5 strict starting restore poll: loanId=${loanId}, expected_initial_balance=${initialBalance}`);
                return F3XAggregationHelpers.waitForLoanBalanceRestoreByApi(loanId, initialBalance, {
                  maxAttempts: 8,
                  intervalMs: 500,
                });
              })
              .then(() => {
                F3XAggregationHelpers.goToReport(reportId);
                assertLoanBalanceValueInList(loanId, initialBalance);
              });
          } else {
            F3XAggregationHelpers.goToReport(reportId);
            F3XAggregationHelpers.assertRowExists(F3XAggregationHelpers.loansAndDebtsTableRoot, loanId);
          }
        });
    });
  });
}

describe('Extended F3X Schedule C/C1/C2 Aggregation', () => {
  beforeEach(() => {
    Initialize();
  });

  it('C1-C5 loan repayment creation decreases balance and deletion preserves repayment integrity', () => {
    cy.wrap(DataSetup({ organization: true })).then((result: any) => {
      F3XAggregationHelpers.seedLoanFromBank(result.report, result.organization).then((loanId) => {
        executeLoanRepaymentLifecycleWithIntegrity(result.report, loanId, false);
      });
    });
  });

  it('C1-C5 strict deleting loan repayment restores parent loan balance to initial', () => {
    // Contract: keep this as a hard-fail signal.
    // If this fails after repayment deletion integrity checks pass, it indicates a backend
    // loan delete-reaggregation regression (not Cypress flake). Do not soften this assertion.
    cy.wrap(DataSetup({ organization: true })).then((result: any) => {
      F3XAggregationHelpers.seedLoanFromBank(result.report, result.organization).then((loanId) => {
        executeLoanRepaymentLifecycleWithIntegrity(result.report, loanId, true);
      });
    });
  });

  it('C2 guarantor add/delete flow keeps parent loan available and recalculates child membership', () => {
    cy.wrap(DataSetup({ committee: true, individual: true })).then((result: any) => {
      ReportListPage.goToReportList(result.report);
      StartTransaction.Loans().ByCommittee();
      ContactLookup.getCommittee(result.committee);

      TransactionDetailPage.enterLoanFormData(
        {
          ...defaultLoanFormData,
          purpose_description: 'Loan by committee',
          memo_text: 'Loan note',
          first_name: 'Robin',
          last_name: 'Taylor',
          authorized_first_name: 'Alex',
          authorized_last_name: 'Morgan',
          authorized_title: 'Manager',
          date_received: undefined,
          amount: 5000,
        },
        false,
        '',
        '#loan-info-amount',
      );

      TransactionDetailPage.addGuarantor(result.individual.last_name, 1000, result.report);
      cy.contains('Loan By Committee').first().click();
      PageUtils.urlCheck('/list');

      cy.get(`${F3XAggregationHelpers.loansAndDebtsTableRoot} tbody tr`)
        .first()
        .find('td')
        .eq(1)
        .find('a')
        .first()
        .invoke('attr', 'href')
        .then((href) => {
          const loanId = (href ?? '').split('/').filter(Boolean).pop() ?? '';
          if (!loanId) {
            throw new Error('Loan id from list row href is missing');
          }

          F3XAggregationHelpers.openLoanOrDebt(loanId);
          cy.contains('Guarantors').should('exist');

          const guarantorDisplayName = [result.individual.last_name, result.individual.first_name]
            .filter(Boolean)
            .join(', ');

          cy.intercept('DELETE', '**/api/v1/transactions/**').as('DeleteGuarantor');
          F3XAggregationHelpers.clickRowActionByCellText(
            'app-transaction-guarantors p-table',
            guarantorDisplayName,
            'Delete',
          );
          F3XAggregationHelpers.confirmDialog();
          cy.wait('@DeleteGuarantor');
          cy.contains(guarantorDisplayName).should('not.exist');
        });
    });
  });
});
