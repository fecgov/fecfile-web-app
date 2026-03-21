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
import { assertDebtFieldValues } from './utils/debt-assertions';

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

  TransactionDetailPage.clickSave();
}

function createDebtRepaymentCallback(result: any) {
  return () => {
    ReportListPage.gotToReportTransactionListPage(result.report);
    cy.contains('Debt Owed By Committee').should('exist');

    PageUtils.clickKababItem(
      'Debt Owed By Committee',
      'Report debt repayment',
      'app-transaction-loans-and-debts',
    );
    PageUtils.urlCheck('select/disbursement?debt=');
    cy.contains('CONTRIBUTIONS/EXPENDITURES TO/ON BEHALF OF REGISTERED FILERS').should('exist');
    PageUtils.clickAccordion('CONTRIBUTIONS/EXPENDITURES TO/ON BEHALF OF REGISTERED FILERS');
    cy.contains('Coordinated Party Expenditure').click({ force: true });

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
      ReportListPage.gotToReportTransactionListPage(result.report);
      StartTransaction.Debts().ByCommittee();

      PageUtils.urlCheck('DEBT_OWED_BY_COMMITTEE');
      PageUtils.containedOnPage('Debt Owed By Committee');
      ContactLookup.getCommittee(result.committee, [], [], '', 'Committee');
      TransactionDetailPage.enterLoanFormData(debtFormData, false, '', '#amount');
      TransactionDetailPage.clickSave();

      ReportListPage.gotToReportTransactionListPage(result.report);
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
      ReportListPage.gotToReportTransactionListPage(result.report);
      StartTransaction.Debts().ToCommittee();

      PageUtils.urlCheck('DEBT_OWED_TO_COMMITTEE');
      PageUtils.containedOnPage('Debt Owed To Committee');

      ContactLookup.getCommittee(result.committee);
      TransactionDetailPage.enterLoanFormData(debtFormData, false, '', '#amount');
      TransactionDetailPage.clickSave();
      PageUtils.urlCheck('/list');
      cy.contains('Debt Owed To Committee').should('exist');
    });
  });

  it('should test debt carry-forward behavior', () => {
    cy.wrap(DataSetup({ committee: true, individual: true })).then((result: any) => {
      ReportListPage.gotToReportTransactionListPage(result.report);
      StartTransaction.Debts().ToCommittee();

      PageUtils.urlCheck('DEBT_OWED_TO_COMMITTEE');
      PageUtils.containedOnPage('Debt Owed To Committee');

      ContactLookup.getCommittee(result.committee);
      TransactionDetailPage.enterLoanFormData({
        ...debtFormData,
        amount: 10000
      }, false, '', '#amount');
      TransactionDetailPage.clickSave();
      PageUtils.urlCheck('/list');
      cy.contains('Debt Owed To Committee').should('exist');
      cy.get('.p-datatable-tbody > tr.ng-star-inserted > :nth-child(6)')
        .contains("$10,000.00").should('exist');

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
      TransactionDetailPage.clickSave();
      PageUtils.urlCheck('/list');
      cy.contains('Individual Receipt').should('exist');
      assertDebtListBalance('Debt Owed To Committee', '$9,000.00');

      openDebtByLabel('Debt Owed To Committee');

      assertDebtFieldValues({
        amount: '$10,000.00',
        balance: '$0.00',
        paymentAmount: '$1,000.00',
        balanceAtClose: '$9,000.00',
      });

      ReportListPage.createF3X({
        ...defaultForm3XData,
        filing_frequency: 'Q',
        report_code: 'Q3',
        coverage_from_date: new Date(currentYear, 7 - 1, 1),
        coverage_through_date: new Date(currentYear, 9 - 1, 30),
      });

      cy.contains("Debt Owed To Committee").should('exist');
      cy.get('.p-datatable-tbody > tr.ng-star-inserted > :nth-child(6)')
        .contains("$9,000.00").should('exist');

      PageUtils.clickLink("Debt Owed To Committee");

      cy.get('#amount').should('exist').clear().safeType('2500');
      TransactionDetailPage.clickSave();
      PageUtils.urlCheck('/list');

      cy.contains("Debt Owed To Committee").should('exist');
      cy.get('.p-datatable-tbody > tr.ng-star-inserted > :nth-child(6)')
        .contains("$11,500.00").should('exist');

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
          date_received: new Date(currentYear, 7 - 1, 15),
          amount: 11500,
        },
        false,
        '',
        true,
        'contribution_date'
      )
      TransactionDetailPage.clickSave();
      PageUtils.urlCheck('/list');
      cy.contains("Debt Owed To Committee").should('exist');
      cy.get('.p-datatable-tbody > tr.ng-star-inserted > :nth-child(6)')
        .contains("$0.00").should('exist');

      PageUtils.clickLink("Debt Owed To Committee");

      assertDebtFieldValues({
        amount: '$2,500.00',
        balance: '$9,000.00',
        paymentAmount: '$11,500.00',
        balanceAtClose: '$0.00',
      });

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
      ContactListPage.deleteAllContacts();
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
