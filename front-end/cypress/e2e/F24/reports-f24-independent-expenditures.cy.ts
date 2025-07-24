import { Initialize } from '../pages/loginPage';
import { currentYear, PageUtils } from '../pages/pageUtils';
import { TransactionDetailPage } from '../pages/transactionDetailPage';
import {
  defaultScheduleFormData as defaultTransactionFormData,
  DisbursementFormData,
} from '../models/TransactionFormModel';
import { F3XSetup } from '../F3X/f3x-setup';
import { StartTransaction } from '../F3X/utils/start-transaction/start-transaction';
import { faker } from '@faker-js/faker';
import { F24Setup } from './f24-setup';
import { ReportListPage } from '../pages/reportListPage';
import { Candidate_House_A, Individual_A_A } from '../requests/library/contacts';
import { ContactLookup } from '../pages/contactLookup';

const independentExpenditureData: DisbursementFormData = {
  ...defaultTransactionFormData,
  ...{
    date2: new Date(currentYear, 4 - 1, 27),
    supportOpposeCode: 'SUPPORT',
    signatoryDateSigned: new Date(currentYear, 4 - 1, 27),
    signatoryFirstName: faker.person.firstName(),
    signatoryLastName: faker.person.lastName(),
  },
};

describe('Form 24 Independent Expenditures', () => {
  beforeEach(() => {
    Initialize();
  });

  it('Independent Expenditures created on a Form 24 should be linked to a Form 3X', () => {
    F24Setup();
    F3XSetup({ individual: true, candidate: true });

    ReportListPage.editReport('FORM 24');
    StartTransaction.IndependentExpenditures().IndependentExpenditure();
    ContactLookup.getContact(Individual_A_A.last_name!, '', 'Individual');

    TransactionDetailPage.enterSheduleFormDataForVoidExpenditure(
      independentExpenditureData,
      { contact_type: 'Candidate', last_name: Candidate_House_A.last_name! },
      false,
      '',
      'date_signed',
    );

    PageUtils.clickButton('Save');
    PageUtils.clickLink('Independent Expenditure');
    cy.contains('Address').should('exist');
    cy.get('#first_name').should('have.value', Individual_A_A.first_name);
    cy.get('#last_name').should('have.value', Individual_A_A.last_name);

    ReportListPage.editReport('JULY 15 QUARTERLY REPORT (Q2)');
    PageUtils.clickSidebarItem('Manage your transactions');
    PageUtils.clickLink('Independent Expenditure');
    cy.contains('Address').should('exist');
    cy.get('#first_name').should('have.value', Individual_A_A.first_name);
    cy.get('#last_name').should('have.value', Individual_A_A.last_name);
  });
});
