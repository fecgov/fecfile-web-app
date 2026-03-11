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
import { makeTransaction } from '../requests/methods';
import { ReportTransactionListPage } from '../pages/reportTransactionListPage';
import { defaultForm3XData } from '../models/ReportFormModel';
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
  cy.get('#general_election_year:visible').safeType(currentYear);
  cy.get('#amount:visible').safeType(100);
  cy.get('#purpose_description:visible').first().safeType('test');

  PageUtils.clickButton('Save');
}

function createDebtRepaymentCallback(result: any) {
  return () => {
    ReportTransactionListPage.goToReportTransactionListPage(result.report);
    cy.contains('Debt Owed By Committee').should('be.visible');

    PageUtils.clickKababItem(
      'Debt Owed By Committee',
      'Report debt repayment',
      'app-transaction-loans-and-debts',
    );
    PageUtils.urlCheck('select/disbursement?debt=');
    cy.contains('CONTRIBUTIONS/EXPENDITURES TO/ON BEHALF OF REGISTERED FILERS').should('be.visible');
    PageUtils.clickAccordion('CONTRIBUTIONS/EXPENDITURES TO/ON BEHALF OF REGISTERED FILERS');
    cy.contains('Coordinated Party Expenditure').click({ force: true });

    setupCoordinatedPartyExpenditure(result.organization, result.committee, result.candidate);

    PageUtils.urlCheck('/list');
    cy.contains('Coordinated Party Expenditure').should('be.visible');

    PageUtils.switchCommittee('c94c5d1a-9e73-464d-ad72-b73b5d8667a9');
  };
}

function handleDebtOwedByCommitteeLoanReportDebtRepayment(result: any) {
  const debt = buildDebtOwedByCommittee(result.committee, result.report, 'TEST DEBT', 6000);
  makeTransaction(debt, createDebtRepaymentCallback(result));
}

describe('Debts', () => {
  beforeEach(() => {
    Initialize();
  });

  it('should test Debt Owed By Committee loan', () => {
    cy.wrap(DataSetup({ committee: true })).then((result: any) => {
      ReportTransactionListPage.goToReportTransactionListPage(result.report);
      StartTransaction.Debts().ByCommittee();

      PageUtils.urlCheck('DEBT_OWED_BY_COMMITTEE');
      PageUtils.containedOnPage('Debt Owed By Committee');
      ContactLookup.getCommittee(result.committee, [], [], '', 'Committee');
      TransactionDetailPage.enterLoanFormData(debtFormData, false, '', '#amount');
      PageUtils.clickButton('Save');

      ReportTransactionListPage.goToReportTransactionListPage(result.report);
      PageUtils.urlCheck('/list');
      cy.contains('Debt Owed By Committee').should('be.visible');

      PageUtils.clickElement('loans-and-debts-button');
      cy.contains('Report debt repayment').click({ force: true });
      PageUtils.urlCheck('select/disbursement?debt=');
      cy.contains('CONTRIBUTIONS/EXPENDITURES TO/ON BEHALF OF REGISTERED FILERS').should('be.visible');
      PageUtils.clickAccordion('CONTRIBUTIONS/EXPENDITURES TO/ON BEHALF OF REGISTERED FILERS');
      cy.contains('Coordinated Party Expenditure').should('not.exist'); // PAC committee
    });
  });

  it('should test Owed To Committee loan', () => {
    cy.wrap(DataSetup({ committee: true })).then((result: any) => {
      ReportTransactionListPage.goToReportTransactionListPage(result.report);
      StartTransaction.Debts().ToCommittee();

      PageUtils.urlCheck('DEBT_OWED_TO_COMMITTEE');
      PageUtils.containedOnPage('Debt Owed To Committee');

      ContactLookup.getCommittee(result.committee);
      TransactionDetailPage.enterLoanFormData(debtFormData, false, '', '#amount');
      PageUtils.clickButton('Save');
      PageUtils.urlCheck('/list');
      cy.contains('Debt Owed To Committee').should('be.visible');
    });
  });

  it('should test debt carry-forward behavior', () => {
    cy.wrap(DataSetup({ committee: true, individual: true })).then((result: any) => {
      ReportTransactionListPage.goToReportTransactionListPage(result.report);
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
      cy.contains('Debt Owed To Committee').should('be.visible');
      cy.get('.p-datatable-tbody > tr.ng-star-inserted > :nth-child(6)')
        .contains("$10,000.00").should('be.visible')

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
      PageUtils.urlCheck('/list');
      cy.contains('Individual Receipt').should('be.visible');
      cy.get('.p-datatable-tbody > tr.ng-star-inserted > :nth-child(6)')
        .contains("$9,000.00").should('be.visible');

      PageUtils.clickLink("Debt Owed To Committee");

      assertDebtFieldValues({
        amount: '$10,000.00',
        balance: '$0.00',
        paymentAmount: '$1,000.00',
        balanceAtClose: '$9,000.00',
      });

      ReportTransactionListPage.createF3X({
        ...defaultForm3XData,
        filing_frequency: 'Q',
        report_code: 'Q3',
        coverage_from_date: new Date(currentYear, 7 - 1, 1),
        coverage_through_date: new Date(currentYear, 9 - 1, 30),
      });

      cy.contains("Debt Owed To Committee").should('be.visible');
      cy.get('.p-datatable-tbody > tr.ng-star-inserted > :nth-child(6)')
        .contains("$9,000.00").should('be.visible');

      PageUtils.clickLink("Debt Owed To Committee");

      cy.get('#amount:visible').should('be.visible').clear().safeType('2500');
      PageUtils.clickButton("Save");
      PageUtils.urlCheck('/list');

      cy.contains("Debt Owed To Committee").should('be.visible');
      cy.get('.p-datatable-tbody > tr.ng-star-inserted > :nth-child(6)')
        .contains("$11,500.00").should('be.visible');

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
      PageUtils.clickButton("Save");
      PageUtils.urlCheck('/list');
      cy.contains("Debt Owed To Committee").should('be.visible');
      cy.get('.p-datatable-tbody > tr.ng-star-inserted > :nth-child(6)')
        .contains("$0.00").should('be.visible');

      PageUtils.clickLink("Debt Owed To Committee");

      assertDebtFieldValues({
        amount: '$2,500.00',
        balance: '$9,000.00',
        paymentAmount: '$11,500.00',
        balanceAtClose: '$0.00',
      });

      cy.intercept(
        'GET',
        `**/api/v1/transactions/?page=1&ordering=line_label,created&page_size=5&report_id=**&schedules=C,D`,
      ).as('GetLoans');

      ReportTransactionListPage.createF3X({
        ...defaultForm3XData,
        filing_frequency: 'Q',
        report_code: 'YE',
        coverage_from_date: new Date(currentYear, 10 - 1, 1),
        coverage_through_date: new Date(currentYear, 12 - 1, 31),
      });

      PageUtils.urlCheck('/list');
      cy.wait('@GetLoans');
      cy.contains("Debt Owed To Committee").should('not.exist');
    });
  });

  describe('test PTY', () => {
    beforeEach(() => {
      PageUtils.switchCommittee('7c176dc0-7062-49b5-bc35-58b4ef050d08');
      ContactListPage.deleteAllContacts();
    });

    afterEach(() => {
      PageUtils.switchCommittee('c94c5d1a-9e73-464d-ad72-b73b5d8667a9');
    });

    it('should test Debt Owed By Committee loan - Report debt repayment', () => {
      cy.wrap(
        DataSetup({
          candidate: true,
          organization: true,
          committee: true,
        }),
      ).then(handleDebtOwedByCommitteeLoanReportDebtRepayment);
    });
  });
});
