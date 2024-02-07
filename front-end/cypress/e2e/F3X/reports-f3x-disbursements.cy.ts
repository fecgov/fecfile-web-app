import { Initialize } from '../pages/loginPage';
import { currentYear, PageUtils } from '../pages/pageUtils';
import { TransactionDetailPage } from '../pages/transactionDetailPage';
import {
  candidateFormData,
  defaultFormData as individualContactFormData,
  organizationFormData,
} from '../models/ContactFormModel';
import {
  defaultScheduleFormData as defaultTransactionFormData,
  DisbursementFormData,
} from '../models/TransactionFormModel';
import { F3XSetup } from './f3x-setup';
import { StartTransaction } from './start-transaction/start-transaction';

const independentExpVoidData: DisbursementFormData = {
  ...defaultTransactionFormData,
  ...{
    date2: new Date(currentYear, 4 - 1, 27),
    supportOpposeCode: 'SUPPORT',
    signatoryDateSigned: new Date(currentYear, 4 - 1, 27),
    signatoryFirstName: PageUtils.randomString(10),
    signatoryLastName: PageUtils.randomString(10),
  },
};

describe('Disbursements', () => {
  beforeEach(() => {
    Initialize();
  });

  it('should test F3xFederalElectionActivityExpendituresPage disbursement', () => {
    F3XSetup({ individual: true });
    StartTransaction.Disbursements().Federal().HundredPercentFederalElectionActivityPayment();

    cy.get('#entity_type_dropdown').type(individualContactFormData.contact_type);
    cy.contains('LOOKUP').should('exist');
    cy.get('[role="searchbox"]').type(individualContactFormData.last_name.slice(0, 1));
    cy.contains(individualContactFormData.last_name).should('exist');
    cy.contains(individualContactFormData.last_name).click();

    TransactionDetailPage.enterScheduleFormData(defaultTransactionFormData);

    PageUtils.clickButton('Save');
    PageUtils.clickLink('100% Federal Election Activity Payment');
    cy.contains(individualContactFormData.first_name).should('exist');
    cy.contains(individualContactFormData.last_name).should('exist');
  });

  it('should test Independent Expenditure - Void Schedule E disbursement', () => {
    F3XSetup({ organization: true, candidate: true });
    StartTransaction.Disbursements().Independent().IndependentExpenditureVoid();

    cy.get('#entity_type_dropdown').type(organizationFormData.contact_type);
    cy.contains('LOOKUP').should('exist');
    cy.get('[role="searchbox"]').type(organizationFormData.name.slice(0, 1));
    cy.contains(organizationFormData.name).should('exist');
    cy.contains(organizationFormData.name).click();

    TransactionDetailPage.enterSheduleFormDataForVoidExpenditure(independentExpVoidData, candidateFormData);

    PageUtils.clickButton('Save');
    PageUtils.clickLink('Independent Expenditure - Void');
    cy.contains(organizationFormData.name).should('exist');
  });
});
