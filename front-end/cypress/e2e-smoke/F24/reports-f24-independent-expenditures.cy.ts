import { Initialize } from '../pages/loginPage';
import { PageUtils } from '../pages/pageUtils';
import { DataSetup } from '../F3X/setup';
import { ReportListPage } from '../pages/reportListPage';
import { createIndependentExpenditureOnForm24 } from './f24.helpers';

describe('Form 24 Independent Expenditures', () => {
  beforeEach(() => {
    Initialize();
  });

  it('Independent Expenditures created on a Form 24 should be linked to a Form 3X', () => {
    cy.wrap(DataSetup({ individual: true, candidate: true, f24: true })).then((result: any) => {
      createIndependentExpenditureOnForm24(
        result.f24,
        result.individual.last_name,
        result.candidate,
      );
      PageUtils.clickLink('Independent Expenditure');
      cy.contains('Address').should('exist');
      cy.get('#first_name').should('have.value', result.individual.first_name);
      cy.get('#last_name').should('have.value', result.individual.last_name);

      ReportListPage.gotToReportTransactionListPage(result.report);
      PageUtils.clickSidebarItem('Manage your transactions');
      PageUtils.clickLink('Independent Expenditure');
      cy.contains('Address').should('exist');
      cy.get('#first_name').should('have.value', result.individual.first_name);
      cy.get('#last_name').should('have.value', result.individual.last_name);
    });
  });
});
