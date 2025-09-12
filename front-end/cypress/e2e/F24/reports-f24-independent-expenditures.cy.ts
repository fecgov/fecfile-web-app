import { Initialize } from '../pages/loginPage';
import { currentYear, PageUtils } from '../pages/pageUtils';
import { TransactionDetailPage } from '../pages/transactionDetailPage';
import {
  defaultScheduleFormData as defaultTransactionFormData,
  DisbursementFormData,
} from '../models/TransactionFormModel';
import { DataSetup } from '../F3X/setup';
import { StartTransaction } from '../F3X/utils/start-transaction/start-transaction';
import { faker } from '@faker-js/faker';
import { ReportListPage } from '../pages/reportListPage';
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
    cy.wrap(DataSetup({ individual: true, candidate: true, f24: true })).then((result: any) => {
      ReportListPage.goToReportList(result.f24, false, true, false);
      StartTransaction.IndependentExpenditures().IndependentExpenditure();
      ContactLookup.getContact(result.individual.last_name, '', 'Individual');

      TransactionDetailPage.enterSheduleFormDataForVoidExpenditure(
        independentExpenditureData,
        result.candidate,
        false,
        '',
        'date_signed',
      );

      PageUtils.clickButton('Save');
      PageUtils.clickLink('Independent Expenditure');
      cy.contains('Address').should('exist');
      cy.get('#first_name').should('have.value', result.individual.first_name);
      cy.get('#last_name').should('have.value', result.individual.last_name);

      ReportListPage.goToReportList(result.report);
      PageUtils.clickSidebarItem('Manage your transactions');
      PageUtils.clickLink('Independent Expenditure');
      cy.contains('Address').should('exist');
      cy.get('#first_name').should('have.value', result.individual.first_name);
      cy.get('#last_name').should('have.value', result.individual.last_name);
    });
  });
});
