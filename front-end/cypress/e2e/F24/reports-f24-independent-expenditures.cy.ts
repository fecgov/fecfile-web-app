import { Initialize } from '../pages/loginPage';
import { currentYear, PageUtils } from '../pages/pageUtils';
import { TransactionDetailPage } from '../pages/transactionDetailPage';
import { candidateFormData, defaultFormData as individualContactFormData } from '../models/ContactFormModel';
import {
  defaultScheduleFormData as defaultTransactionFormData,
  DisbursementFormData,
} from '../models/TransactionFormModel';
import { F3XSetup } from '../F3X/f3x-setup';
import { StartTransaction } from '../F3X/utils/start-transaction/start-transaction';
import { faker } from '@faker-js/faker';
import { F24Setup } from './f24-setup';
import { ReportListPage } from '../pages/reportListPage';
import { defaultForm3XData } from '../models/ReportFormModel';

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
    const f3x_report_data = {
      ...defaultForm3XData,
    };
    F3XSetup({ individual: true, candidate: true, report: f3x_report_data });
    F24Setup();
    StartTransaction.IndependentExpenditures().IndependentExpenditure();

    PageUtils.dropdownSetValue('#entity_type_dropdown', individualContactFormData.contact_type, '');
    cy.contains('LOOKUP').should('exist');
    cy.get('[id="searchBox"]').type(individualContactFormData.last_name.slice(0, 1));
    cy.contains(individualContactFormData.last_name).should('exist');
    cy.contains(individualContactFormData.last_name).click();

    TransactionDetailPage.enterSheduleFormDataForVoidExpenditure(
      independentExpenditureData,
      candidateFormData,
      false,
      '',
      'date_signed',
    );

    PageUtils.clickButton('Save');
    PageUtils.clickLink('Independent Expenditure');
    cy.contains('Address').should('exist');
    cy.get('#first_name').should('have.value', individualContactFormData.first_name);
    cy.get('#last_name').should('have.value', individualContactFormData.last_name);

    ReportListPage.editReport('12-DAY PRE-GENERAL');
    PageUtils.clickSidebarItem('Manage your transactions');
    PageUtils.clickLink('Independent Expenditure');
    cy.contains('Address').should('exist');
    cy.get('#first_name').should('have.value', individualContactFormData.first_name);
    cy.get('#last_name').should('have.value', individualContactFormData.last_name);
  });
});
