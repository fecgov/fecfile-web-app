import { defaultDebtFormData as debtFormData } from '../models/TransactionFormModel';
import { Initialize } from '../pages/loginPage';
import { currentYear, PageUtils } from '../pages/pageUtils';
import { TransactionDetailPage } from '../pages/transactionDetailPage';
import { F3XSetup, Setup } from './f3x-setup';
import { StartTransaction } from './utils/start-transaction/start-transaction';
import { ContactFormData } from '../models/ContactFormModel';
import { ContactListPage } from '../pages/contactListPage';

describe('Debts', () => {
  beforeEach(() => {
    Initialize();
  });

  function setupDebtOwedByCommittee(setup: Setup) {
    return cy.wrap(F3XSetup(setup)).then((result: any) => {
      cy.visit(`/reports/transactions/report/${result.report}/list`);
      StartTransaction.Debts().ByCommittee();

      PageUtils.urlCheck('DEBT_OWED_BY_COMMITTEE');
      PageUtils.containedOnPage('Debt Owed By Committee');
      TransactionDetailPage.getContact(result.committee, '', 'Committee');
      TransactionDetailPage.enterLoanFormData(debtFormData);
      PageUtils.clickButton('Save');
      return cy.wrap(result);
    });
  }

  function setupCoordinatedPartyExpenditure(
    organization: ContactFormData,
    committee: ContactFormData,
    candidate: ContactFormData,
  ) {
    PageUtils.urlCheck('COORDINATED_PARTY_EXPENDITURE');
    PageUtils.containedOnPage('Coordinated Party Expenditure');
    TransactionDetailPage.getContact(organization, '', 'Organization');
    PageUtils.searchBoxInput(committee.committee_id, 'contact_3_lookup');
    PageUtils.searchBoxInput(candidate.candidate_id, 'contact_2_lookup');

    TransactionDetailPage.enterDate(`[data-cy="expenditure_date"]`, new Date(currentYear, 4 - 1, 27));
    cy.get('#general_election_year').safeType(currentYear);
    cy.get('#amount').safeType(100.0);
    cy.get('#purpose_description').first().safeType('test');

    PageUtils.clickButton('Save');
  }

  it('should test Debt Owed By Committee loan', () => {
    setupDebtOwedByCommittee({ committee: true }).then((result: any) => {
      cy.visit(`/reports/transactions/report/${result.report}/list`);
      PageUtils.urlCheck('/list');
      cy.contains('Debt Owed By Committee').should('exist');

      PageUtils.clickElement('loans-and-debts-button');
      cy.contains('Report debt repayment').click({ force: true });
      PageUtils.urlCheck('select/disbursement?debt=');
      cy.contains('CONTRIBUTIONS/EXPENDITURES TO REGISTERED FILERS').should('exist');
      PageUtils.clickAccordion('CONTRIBUTIONS/EXPENDITURES TO REGISTERED FILERS');
      cy.contains('Coordinated Party Expenditure').should('not.exist'); // PAC committee
    });
  });

  it('should test Owed To Committee loan', () => {
    setupDebtOwedByCommittee({ committee: true }).then((result: any) => {
      cy.visit(`/reports/transactions/report/${result.report}/list`);
      StartTransaction.Debts().ToCommittee();

      PageUtils.urlCheck('DEBT_OWED_TO_COMMITTEE');
      PageUtils.containedOnPage('Debt Owed To Committee');

      PageUtils.searchBoxInput(result.committee.committee_id);
      TransactionDetailPage.enterLoanFormData(debtFormData);
      PageUtils.clickButton('Save');
      PageUtils.urlCheck('/list');
      cy.contains('Debt Owed To Committee').should('exist');
    });
  });

  it('should test Debt Owed By Committee loan - Report debt repayment', () => {
    ContactListPage.deleteAllContacts();
    PageUtils.switchCommittee('7c176dc0-7062-49b5-bc35-58b4ef050d08');

    cy.location('pathname').should('include', '/reports');

    setupDebtOwedByCommittee({
      candidate: true,
      organization: true,
      committee: true,
    }).then((result: any) => {
      cy.visit(`/reports/transactions/report/${result.report}/list`);
      cy.contains('Debt Owed By Committee').should('exist');

      PageUtils.clickElement('loans-and-debts-button');
      cy.contains('Report debt repayment').click({ force: true });
      PageUtils.urlCheck('select/disbursement?debt=');
      cy.contains('CONTRIBUTIONS/EXPENDITURES TO REGISTERED FILERS').should('exist');
      PageUtils.clickAccordion('CONTRIBUTIONS/EXPENDITURES TO REGISTERED FILERS');
      cy.contains('Coordinated Party Expenditure').click({ force: true });
      setupCoordinatedPartyExpenditure(result.organization, result.committee, result.candidate);
      PageUtils.urlCheck('/list');
      cy.contains('Coordinated Party Expenditure').should('exist');

      PageUtils.switchCommittee('c94c5d1a-9e73-464d-ad72-b73b5d8667a9');
    });
  });
});
