import { defaultDebtFormData as debtFormData } from '../models/TransactionFormModel';
import { Initialize } from '../pages/loginPage';
import { currentYear, PageUtils } from '../pages/pageUtils';
import { TransactionDetailPage } from '../pages/transactionDetailPage';
import { DataSetup } from './setup';
import { StartTransaction } from './utils/start-transaction/start-transaction';
import { ContactFormData } from '../models/ContactFormModel';
import { ContactListPage } from '../pages/contactListPage';
import { ContactLookup } from '../pages/contactLookup';
import { buildDebtOwedByCommittee } from '../requests/library/transactions';
import { ReportListPage } from '../pages/reportListPage';
import { defaultScheduleFormData } from '../models/TransactionFormModel'
import { F3XAggregationHelpers } from '../../e2e-extended/f3x/f3x-aggregation.helpers';
import { makeF3x } from '../requests/methods';
import { F3X_Q3 } from '../requests/library/reports';

function setupCoordinatedPartyExpenditure(
  organization: ContactFormData,
  committee: ContactFormData,
  candidate: ContactFormData,
) {
  PageUtils.urlCheck('COORDINATED_PARTY_EXPENDITURE');
  PageUtils.containedOnPage('Coordinated Party Expenditure');
  ContactLookup.getContact(organization.name, '', 'Organization');
  ContactLookup.getCommittee(committee, [], [], '#contact_3_lookup');
  ContactLookup.getCandidate(candidate, [], [], '#contact_2_lookup');

  TransactionDetailPage.enterDate('[data-cy="expenditure_date"]', new Date(currentYear, 4 - 1, 27));
  cy.get('#general_election_year').safeType(currentYear);
  cy.get('#amount').safeType(100);
  cy.get('#purpose_description').first().safeType('test');

  PageUtils.clickButton('Save');
}

function exactText(value: string): RegExp {
  return new RegExp(`^\\s*${Cypress._.escapeRegExp(value)}\\s*$`);
}

function debtRowByLabel(label: string): Cypress.Chainable<JQuery<HTMLTableRowElement>> {
  return cy
    .get(F3XAggregationHelpers.loansAndDebtsTableRoot)
    .contains('a', exactText(label))
    .closest('tr');
}

function assertDebtListBalance(label: string, expected: string): void {
  debtRowByLabel(label).find('td').eq(5).should('contain', expected);
}

function openDebtByLabel(label: string): void {
  cy.get(F3XAggregationHelpers.loansAndDebtsTableRoot)
    .contains('a', exactText(label))
    .click();
}

function debtTransactionIdByLabelAndBalance(label: string, expectedBalance: string): Cypress.Chainable<string> {
  return cy
    .get(F3XAggregationHelpers.loansAndDebtsTableRoot)
    .find('tbody tr')
    .filter((_, row) => {
      const $row = Cypress.$(row);
      const rowLabel = $row.find('a').first().text().trim();
      const rowBalance = $row.find('td').eq(5).text();
      return exactText(label).test(rowLabel) && rowBalance.includes(expectedBalance);
    })
    .should('have.length.at.least', 1)
    .first()
    .find('a')
    .first()
    .should('have.attr', 'href')
    .then((href) => {
      const match = /\/list\/([0-9a-f-]+)/i.exec(href);
      const debtId = match?.[1];

      expect(debtId, `debt transaction id in href ${href}`).to.be.a('string');

      if (!debtId) {
        throw new Error(`Could not parse debt transaction id from href ${href}`);
      }

      return debtId;
    });
}

function createF3XReport(reportRequest: Parameters<typeof makeF3x>[0]): Cypress.Chainable<string> {
  return makeF3x(reportRequest).then((response) => {
    const reportId = response.body?.id;

    expect(reportId, `created report id for ${reportRequest.report_code}`).to.be.a('string');

    if (!reportId) {
      throw new Error(`Could not parse created report id for ${reportRequest.report_code}`);
    }

    return reportId;
  });
}

function waitForDebtBalanceAtCloseByApi(
  debtId: string,
  expectedBalance: string,
  options: { maxAttempts?: number; intervalMs?: number } = {},
): Cypress.Chainable<void> {
  const maxAttempts = options.maxAttempts ?? 8;
  const intervalMs = options.intervalMs ?? 500;

  const poll = (attempt: number): Cypress.Chainable<void> => {
    return F3XAggregationHelpers.getTransaction(debtId).then((transaction) => {
      const actualBalance = String(transaction?.balance_at_close ?? '');

      if (actualBalance === expectedBalance) {
        return;
      }

      if (attempt >= maxAttempts) {
        expect(
          actualBalance,
          `Debt balance_at_close via API (attempt ${attempt + 1}/${maxAttempts + 1})`,
        ).to.equal(expectedBalance);
        return;
      }

      return cy.wait(intervalMs).then(() => poll(attempt + 1));
    });
  };

  return poll(0);
}

function continueDebtRepaymentFlow(result: any, debtId: string): void {
  ReportListPage.goToReportList(result.report);
  F3XAggregationHelpers.assertRowExists(F3XAggregationHelpers.loansAndDebtsTableRoot, debtId);
  F3XAggregationHelpers.openDebtDisbursementRepaymentSelection(debtId);
  cy.contains('CONTRIBUTIONS/EXPENDITURES TO/ON BEHALF OF REGISTERED FILERS').should('exist');
  PageUtils.clickAccordion('CONTRIBUTIONS/EXPENDITURES TO/ON BEHALF OF REGISTERED FILERS');
  cy.contains('Coordinated Party Expenditure').click();

  setupCoordinatedPartyExpenditure(result.organization, result.committee, result.candidate);

  ReportListPage.goToReportList(result.report, false, true, true);
  cy.contains('Coordinated Party Expenditure').should('exist');

  PageUtils.switchCommittee('c94c5d1a-9e73-464d-ad72-b73b5d8667a9');
}

function handleDebtOwedByCommitteeLoanReportDebtRepayment(result: any) {
  const debt = buildDebtOwedByCommittee(result.committee, result.report, 'TEST DEBT', 6000);
  F3XAggregationHelpers.createTransaction(debt).then((createdDebt) => {
    continueDebtRepaymentFlow(result, createdDebt.id);
  });
}

describe('Debts', () => {
  beforeEach(() => {
    Initialize();
  });

  it('should test Debt Owed By Committee loan', () => {
    cy.wrap(DataSetup({ committee: true })).then((result: any) => {
      ReportListPage.goToReportList(result.report);
      StartTransaction.Debts().ByCommittee();

      PageUtils.urlCheck('DEBT_OWED_BY_COMMITTEE');
      PageUtils.containedOnPage('Debt Owed By Committee');
      ContactLookup.getCommittee(result.committee, [], [], '', 'Committee');
      TransactionDetailPage.enterLoanFormData(debtFormData, false, '', '#amount');
      PageUtils.clickButton('Save');

      ReportListPage.goToReportList(result.report);
      PageUtils.urlCheck('/list');
      cy.contains('Debt Owed By Committee').should('exist');

      PageUtils.clickElement('loans-and-debts-button');
      cy.contains('Report debt repayment').click();
      PageUtils.urlCheck('select/disbursement?debt=');
      cy.contains('CONTRIBUTIONS/EXPENDITURES TO/ON BEHALF OF REGISTERED FILERS').should('exist');
      PageUtils.clickAccordion('CONTRIBUTIONS/EXPENDITURES TO/ON BEHALF OF REGISTERED FILERS');
      cy.contains('Coordinated Party Expenditure').should('not.exist'); // PAC committee
    });
  });

  it('should test Owed To Committee loan', () => {
    cy.wrap(DataSetup({ committee: true })).then((result: any) => {
      ReportListPage.goToReportList(result.report);
      StartTransaction.Debts().ToCommittee();

      PageUtils.urlCheck('DEBT_OWED_TO_COMMITTEE');
      PageUtils.containedOnPage('Debt Owed To Committee');

      ContactLookup.getCommittee(result.committee);
      TransactionDetailPage.enterLoanFormData(debtFormData, false, '', '#amount');
      PageUtils.clickButton('Save');
      PageUtils.urlCheck('/list');
      cy.contains('Debt Owed To Committee').should('exist');
    });
  });

  it('should test debt carry-forward behavior', () => {
    cy.wrap(DataSetup({ committee: true, individual: true })).then((result: any) => {
      ReportListPage.goToReportList(result.report);
      StartTransaction.Debts().ToCommittee();

      PageUtils.urlCheck('DEBT_OWED_TO_COMMITTEE');
      PageUtils.containedOnPage('Debt Owed To Committee');

      ContactLookup.getCommittee(result.committee);
      TransactionDetailPage.enterLoanFormData({
        ...debtFormData,
        amount: 10000
      }, false, '', '#amount');
      PageUtils.clickButton('Save');
      PageUtils.urlCheck('/list');
      debtRowByLabel('Debt Owed To Committee').should('exist');
      assertDebtListBalance('Debt Owed To Committee', '$10,000.00');

      PageUtils.clickKababItem(
        'Debt Owed To Committee',
        "Report debt repayment"
      );

      PageUtils.clickAccordion("CONTRIBUTIONS FROM INDIVIDUALS/PERSONS")
      PageUtils.clickLink("Individual Receipt");
      ContactLookup.getContact(result.individual.last_name)
      TransactionDetailPage.enterScheduleFormData(
        {
          ...defaultScheduleFormData,
          electionType: undefined,
          electionYear: undefined,
          amount: 1000,
        },
        false,
        '',
        true,
        'contribution_date'
      )
      PageUtils.clickButton("Save");
      ReportListPage.goToReportList(result.report);
      cy.contains('Individual Receipt').should('exist');
      assertDebtListBalance('Debt Owed To Committee', '$9,000.00');

      openDebtByLabel('Debt Owed To Committee');

      cy.get('#balance').should('exist').should('have.value', '$0.00');
      cy.get('#amount').should('have.value', '$10,000.00');
      cy.get('#payment_amount').should('have.value', '$1,000.00');
      cy.get('#balance_at_close').should('have.value', '$9,000.00');

      createF3XReport(F3X_Q3).then((q3ReportId) => {
        ReportListPage.goToReportList(q3ReportId);
        debtRowByLabel('Debt Owed To Committee').should('exist');
        assertDebtListBalance('Debt Owed To Committee', '$9,000.00');

        debtTransactionIdByLabelAndBalance('Debt Owed To Committee', '$9,000.00').then((carriedForwardDebtId) => {
          F3XAggregationHelpers.openRowById(
            F3XAggregationHelpers.loansAndDebtsTableRoot,
            carriedForwardDebtId,
          );

          cy.get('#amount').should('exist').clear().safeType('2500');
          cy.get('#amount').blur();
          cy.get('#balance_at_close').should('have.value', '$11,500.00');
          PageUtils.clickButton("Save");

          ReportListPage.goToReportList(q3ReportId);
          F3XAggregationHelpers.assertRowExists(
            F3XAggregationHelpers.loansAndDebtsTableRoot,
            carriedForwardDebtId,
          );
          F3XAggregationHelpers.assertLoansBalance(carriedForwardDebtId, '$11,500.00');

          F3XAggregationHelpers.openDebtRepaymentSelection(carriedForwardDebtId);

          PageUtils.clickAccordion("CONTRIBUTIONS FROM INDIVIDUALS/PERSONS")
          PageUtils.clickLink("Individual Receipt");
          ContactLookup.getContact(result.individual.last_name)
          TransactionDetailPage.enterScheduleFormData(
            {
              ...defaultScheduleFormData,
              electionType: undefined,
              electionYear: undefined,
              date_received: new Date(currentYear, 7 - 1, 15),
              amount: 11500,
            },
            false,
            '',
            true,
            'contribution_date'
          )
          PageUtils.clickButton("Save");

          waitForDebtBalanceAtCloseByApi(carriedForwardDebtId, '0.00');

          ReportListPage.goToReportList(q3ReportId);
          F3XAggregationHelpers.assertRowExists(
            F3XAggregationHelpers.loansAndDebtsTableRoot,
            carriedForwardDebtId,
          );
          F3XAggregationHelpers.assertLoansBalance(carriedForwardDebtId, '$0.00');

          F3XAggregationHelpers.openRowById(
            F3XAggregationHelpers.loansAndDebtsTableRoot,
            carriedForwardDebtId,
          );

          cy.get('#balance').should('exist').should('have.value', '$9,000.00');
          cy.get('#amount').should('have.value', '$2,500.00');
          cy.get('#payment_amount').should('have.value', '$11,500.00');
          cy.get('#balance_at_close').should('have.value', '$0.00');

          createF3XReport({
            ...F3X_Q3,
            report_code: 'YE',
            coverage_from_date: `${currentYear}-10-01`,
            coverage_through_date: `${currentYear}-12-31`,
          }).then((yearEndReportId) => {
            ReportListPage.goToReportList(yearEndReportId);
            F3XAggregationHelpers.assertLoanOrDebtTransactionAbsent(carriedForwardDebtId);
          });
        });
      });
    });
  });

  it('deleting a debt repayment recalculates debt balance_at_close', () => {
    cy.wrap(DataSetup({ committee: true, individual: true })).then((result: any) => {
      F3XAggregationHelpers.createDebtToCommitteeWithReceiptRepayment({
        reportId: result.report,
        committee: result.committee,
        individual: result.individual,
        debtAmount: 6000,
        repaymentAmount: 1000,
        repaymentDate: new Date(currentYear, 4 - 1, 20),
        debtContextLabel: 'deleting debt repayment - create debt',
        repaymentContextLabel: 'deleting debt repayment - create repayment',
      }).then(({ debtId, repaymentId }) => {
        F3XAggregationHelpers.goToReport(result.report);
        F3XAggregationHelpers.openRowById(F3XAggregationHelpers.loansAndDebtsTableRoot, debtId);
        cy.get('#balance_at_close').should('have.value', '$5,000.00');
        F3XAggregationHelpers.clickSave();

        F3XAggregationHelpers.deleteTransactionById(repaymentId);
        F3XAggregationHelpers.goToReport(result.report);

        F3XAggregationHelpers.openRowById(F3XAggregationHelpers.loansAndDebtsTableRoot, debtId);
        cy.get('#balance_at_close').should('have.value', '$6,000.00');
      });
    });
  });

  describe('test PTY', () => {
    beforeEach(() => {
      ContactListPage.deleteAllContacts();
      PageUtils.switchCommittee('7c176dc0-7062-49b5-bc35-58b4ef050d08');
    });

    afterEach(() => {
      PageUtils.switchCommittee('c94c5d1a-9e73-464d-ad72-b73b5d8667a9');
    });

    it('should test Debt Owed By Committee loan - Report debt repayment', () => {
      cy.wrap(
        DataSetup({
          organization: true,
        }),
      ).then((result: any) => {
        return F3XAggregationHelpers.createContact(F3XAggregationHelpers.uniqueCommitteeSeed()).then((committee) => {
          return F3XAggregationHelpers.createContact(F3XAggregationHelpers.uniqueHouseCandidateSeed()).then((candidate) => {
            handleDebtOwedByCommitteeLoanReportDebtRepayment({ ...result, committee, candidate });
          });
        });
      });
    });
  });
});
