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
import { ReportListPage } from '../pages/reportListPage';

describe('Debts', () => {
  beforeEach(() => {
    Initialize();
    PageUtils.switchCommittee('c94c5d1a-9e73-464d-ad72-b73b5d8667a9');
  });

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

    TransactionDetailPage.enterDate(`[data-cy="expenditure_date"]`, new Date(currentYear, 4 - 1, 27));
    cy.get('#general_election_year').safeType(currentYear);
    cy.get('#amount').safeType(100.0);
    cy.get('#purpose_description').first().safeType('test');

    PageUtils.clickButton('Save');
  }

  it('should test Debt Owed By Committee loan', () => {
    cy.wrap(DataSetup({ committee: true })).then((result: any) => {
      ReportListPage.goToReportList(result.report);
      StartTransaction.Debts().ByCommittee();

      PageUtils.urlCheck('DEBT_OWED_BY_COMMITTEE');
      PageUtils.containedOnPage('Debt Owed By Committee');
      ContactLookup.getCommittee(result.committee, [], [], '', 'Committee');
      TransactionDetailPage.enterLoanFormData(debtFormData);
      PageUtils.clickButton('Save');

      ReportListPage.goToReportList(result.report);
      PageUtils.urlCheck('/list');
      cy.contains('Debt Owed By Committee').should('exist');

      PageUtils.clickElement('loans-and-debts-button');
      cy.contains('Report debt repayment').click({ force: true });
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
      TransactionDetailPage.enterLoanFormData(debtFormData);
      PageUtils.clickButton('Save');
      PageUtils.urlCheck('/list');
      cy.contains('Debt Owed To Committee').should('exist');
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
          candidate: true,
          organization: true,
          committee: true,
        }),
      ).then((result: any) => {
        const debt = buildDebtOwedByCommittee(result.committee, result.report, 'TEST DEBT', 6000);
        makeTransaction(debt, () => {
          ReportListPage.goToReportList(result.report);
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
          PageUtils.urlCheck('/list');
          cy.contains('Coordinated Party Expenditure').should('exist');

          PageUtils.switchCommittee('c94c5d1a-9e73-464d-ad72-b73b5d8667a9');
        });
      });
    });
  });
});
