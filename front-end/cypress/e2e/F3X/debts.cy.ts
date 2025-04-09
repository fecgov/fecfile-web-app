import { candidateFormData, committeeFormData, organizationFormData } from '../models/ContactFormModel';
import { defaultDebtFormData as debtFormData } from '../models/TransactionFormModel';
import { Initialize } from '../pages/loginPage';
import { currentYear, PageUtils } from '../pages/pageUtils';
import { TransactionDetailPage } from '../pages/transactionDetailPage';
import { F3XSetup, Setup } from './f3x-setup';
import { StartTransaction } from './utils/start-transaction/start-transaction';

describe('Debts', () => {
  beforeEach(() => {
    Initialize();
  });

  function setupDebtOwedByCommittee(setup: Setup) {
    F3XSetup(setup);
    StartTransaction.Debts().ByCommittee();

    PageUtils.urlCheck('DEBT_OWED_BY_COMMITTEE');
    PageUtils.containedOnPage('Debt Owed By Committee');
    PageUtils.dropdownSetValue('#entity_type_dropdown', committeeFormData.contact_type, '');
    PageUtils.searchBoxInput(committeeFormData.committee_id);
    TransactionDetailPage.enterLoanFormData(debtFormData);
    PageUtils.clickButton('Save');
  }

  function setupCoordinatedPartyExpenditure() {
    PageUtils.urlCheck('COORDINATED_PARTY_EXPENDITURE');
    PageUtils.containedOnPage('Coordinated Party Expenditure');
    PageUtils.dropdownSetValue('#entity_type_dropdown', organizationFormData.contact_type, '');
    PageUtils.searchBoxInput(organizationFormData.name);
    PageUtils.searchBoxInput(committeeFormData.committee_id, 'contact_3_lookup');
    PageUtils.searchBoxInput(candidateFormData.candidate_id, 'contact_2_lookup');

    TransactionDetailPage.enterDate(`[data-cy="expenditure_date"]`, new Date(currentYear, 4 - 1, 27));
    cy.get('#general_election_year').safeType(currentYear);
    cy.get('#amount').safeType(100.0);
    cy.get('#purpose_description').first().safeType('test');

    PageUtils.clickButton('Save');
  }

  it('should test Debt Owed By Committee loan', () => {
    setupDebtOwedByCommittee({ committee: true });
    PageUtils.urlCheck('/list');
    cy.contains('Debt Owed By Committee').should('exist');

    PageUtils.clickElement('loans-and-debts-button');
    cy.contains('Report debt repayment').click({ force: true });
    PageUtils.urlCheck('select/disbursement?debt=');
    cy.contains('CONTRIBUTIONS/EXPENDITURES TO REGISTERED FILERS').should('exist');
    PageUtils.clickAccordion('CONTRIBUTIONS/EXPENDITURES TO REGISTERED FILERS');
    cy.contains('Coordinated Party Expenditure').should('not.exist'); // PAC committee
  });

  it('should test Owed To Committee loan', () => {
    F3XSetup({ committee: true });
    StartTransaction.Debts().ToCommittee();

    PageUtils.urlCheck('DEBT_OWED_TO_COMMITTEE');
    PageUtils.containedOnPage('Debt Owed To Committee');

    PageUtils.searchBoxInput(committeeFormData['committee_id']);
    TransactionDetailPage.enterLoanFormData(debtFormData);
    PageUtils.clickButton('Save');
    PageUtils.urlCheck('/list');
    cy.contains('Debt Owed To Committee').should('exist');
  });

  it('should test Debt Owed By Committee loan - Report debt repayment', () => {
    PageUtils.switchCommittee('7c176dc0-7062-49b5-bc35-58b4ef050d08');
    cy.location('pathname').should('include', '/reports');
    setupDebtOwedByCommittee({
      candidate: true,
      organization: true,
      committee: true,
    });
    PageUtils.urlCheck('/list');
    cy.contains('Debt Owed By Committee').should('exist');

    PageUtils.clickElement('loans-and-debts-button');
    cy.contains('Report debt repayment').click({ force: true });
    PageUtils.urlCheck('select/disbursement?debt=');
    cy.contains('CONTRIBUTIONS/EXPENDITURES TO REGISTERED FILERS').should('exist');
    PageUtils.clickAccordion('CONTRIBUTIONS/EXPENDITURES TO REGISTERED FILERS');
    cy.contains('Coordinated Party Expenditure').click({ force: true });
    setupCoordinatedPartyExpenditure();

    PageUtils.urlCheck('/list');
    cy.contains('Coordinated Party Expenditure').should('exist');
  });
});
