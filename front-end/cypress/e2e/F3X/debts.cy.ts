import { Initialize } from '../pages/loginPage';
import { PageUtils } from '../pages/pageUtils';
import { TransactionDetailPage } from '../pages/transactionDetailPage';
import { defaultDebtFormData as debtFormData } from '../models/TransactionFormModel';
import { committeeFormData } from '../models/ContactFormModel';
import { F3XSetup } from './f3x-setup';
import { StartTransaction } from './start-transaction/start-transaction';

describe('Debts', () => {
  beforeEach(() => {
    Initialize();
  });

  it('should test Debt Owed By Committee loan', () => {
    F3XSetup({ committee: true });
    StartTransaction.Debts().ByCommittee();

    PageUtils.urlCheck('DEBT_OWED_BY_COMMITTEE');
    PageUtils.containedOnPage('Debt Owed By Committee');
    PageUtils.dropdownSetValue('#entity_type_dropdown', committeeFormData.contact_type, '');
    PageUtils.searchBoxInput(committeeFormData.committee_id);
    TransactionDetailPage.enterLoanFormData(debtFormData);
    PageUtils.clickButton('Save');
    PageUtils.urlCheck('/list');
    cy.contains('Debt Owed By Committee').should('exist');
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
});
