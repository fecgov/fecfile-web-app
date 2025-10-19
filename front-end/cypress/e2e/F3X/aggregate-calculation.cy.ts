import { Initialize } from '../pages/loginPage';
import { currentYear, PageUtils } from '../pages/pageUtils';
import { TransactionDetailPage } from '../pages/transactionDetailPage';
import { DataSetup } from './setup';
import { StartTransaction } from './utils/start-transaction/start-transaction';
import {
  defaultScheduleFormData as defaultTransactionFormData,
  DisbursementFormData,
} from '../models/TransactionFormModel';
import { faker } from '@faker-js/faker';
import { makeTransaction } from '../requests/methods';
import { buildScheduleA } from '../requests/library/transactions';
import { ContactLookup } from '../pages/contactLookup';
import { ReportListPage } from '../pages/reportListPage';

function setupTransactions(secondSame: boolean) {
  return cy.wrap(DataSetup({ individual: true, individual2: true })).then((result: any) => {
    const transaction_a = buildScheduleA('INDIVIDUAL_RECEIPT', 200.01, '2025-04-12', result.individual, result.report);
    const transaction_b = buildScheduleA(
      'INDIVIDUAL_RECEIPT',
      25.0,
      '2025-04-16',
      secondSame ? result.individual : result.individual2,
      result.report,
    );
    makeTransaction(transaction_a);
    makeTransaction(transaction_b);

    cy.wrap(result);
  });
}

describe('Tests transaction form aggregate calculation', () => {
  beforeEach(() => {
    Initialize();
  });

  it('new transaction aggregate', () => {
    setupTransactions(true).then((result: any) => {
      ReportListPage.goToReportList(result.report);

      cy.get(':nth-child(2) > :nth-child(2) > a').click();
      cy.contains('Create a new contact').should('exist');

      cy.get('[id=aggregate]').should('have.value', '$225.01');

      // Tests moving the date to be earlier
      TransactionDetailPage.enterDate('[data-cy="contribution_date"]', new Date(2025, 3, 10), '');
      cy.get('h1').click(); // clicking outside of fields to ensure that the amount field loses focus and updates
      cy.get('[id=aggregate]').should('have.value', '$25.00');

      // Move the date back
      TransactionDetailPage.enterDate('[data-cy="contribution_date"]', new Date(currentYear, 3, 30), '');
      cy.get('h1').click(); // clicking outside of fields to ensure that the amount field loses focus and updates
      cy.get('[id=aggregate]').should('have.value', '$225.01');

      // Change the contact
      ContactLookup.getContact(result.individual2.last_name);
      cy.get('[id=aggregate]').should('have.value', '$25.00');

      // Change the contact back
      ContactLookup.getContact(result.individual.last_name);
      cy.get('[id=aggregate]').should('have.value', '$225.01');

      // Change the amount
      cy.get('[id="amount"]').clear().safeType('40');
      cy.get('h1').click(); // clicking outside of fields to ensure that the amount field loses focus and updates
      cy.get('[id=aggregate]').should('have.value', '$240.01');
      PageUtils.clickButton('Save');

      cy.contains('Transactions in this report').should('exist');
      cy.get('.p-datatable-tbody > :nth-child(1) > :nth-child(7)').should('contain', '$200.01');
      cy.get('.p-datatable-tbody > :nth-child(2) > :nth-child(7)').should('contain', '$240.01');
    });
  });

  it('existing transaction change contact', () => {
    setupTransactions(false).then((result: any) => {
      ReportListPage.goToReportList(result.report);
      cy.contains('Transactions in this report').should('exist');
      cy.get('.p-datatable-tbody > :nth-child(2) > :nth-child(2) > a').click();

      // Tests changing the second transaction's contact
      cy.get('[id=aggregate]').should('have.value', '$25.00');
      //cy.get('[id="searchBox"]').type('A');
      PageUtils.typeIntoLookup('A');
      cy.contains('Ant').should('exist');
      cy.contains('Ant').click({ force: true });
      cy.get('h1').click(); // clicking outside of fields to ensure that the amount field loses focus and updates

      cy.get('[id=aggregate]').should('have.value', '$225.01');
      PageUtils.clickButton('Save');

      cy.contains('Transactions in this report').should('exist');
      cy.get('.p-datatable-tbody > :nth-child(1) > :nth-child(7)').should('contain', '$200.01');
      cy.get('.p-datatable-tbody > :nth-child(2) > :nth-child(7)').should('contain', '$225.01');
    });
  });

  it('existing transaction change amount', () => {
    setupTransactions(true).then((result: any) => {
      ReportListPage.goToReportList(result.report);
      cy.contains('Transactions in this report').should('exist');
      cy.get('.p-datatable-tbody > :nth-child(2) > :nth-child(2) > a').click();

      // Tests changing the amount
      cy.get('[id=aggregate]').should('have.value', '$225.01');
      cy.get('[id="amount"]').clear().safeType('40');
      cy.get('h1').click(); // clicking outside of fields to ensure that the amount field loses focus and updates

      cy.get('[id=aggregate]').should('have.value', '$240.01');
      PageUtils.clickButton('Save');

      cy.contains('Transactions in this report').should('exist');
      cy.get('.p-datatable-tbody > :nth-child(1) > :nth-child(7)').should('contain', '$200.01');
      cy.get('.p-datatable-tbody > :nth-child(2) > :nth-child(7)').should('contain', '$240.01');
    });
  });

  it('existing transaction date leapfrogging', () => {
    setupTransactions(true).then((result: any) => {
      ReportListPage.goToReportList(result.report);
      cy.contains('Transactions in this report').should('exist');
      cy.get('.p-datatable-tbody > :nth-child(1) > :nth-child(2) > a').click();

      // Tests moving the first transaction's date to be later than the second
      TransactionDetailPage.enterDate('[data-cy="contribution_date"]', new Date(currentYear, 3, 30), '');
      cy.get('h1').click(); // clicking outside of fields to ensure that the amount field loses focus and updates

      cy.get('[id=aggregate]').should('have.value', '$225.01');
      PageUtils.clickButton('Save');

      cy.contains('Transactions in this report').should('exist');
      cy.get('.p-datatable-tbody > :nth-child(1) > :nth-child(7)').should('contain', '$225.01');
      cy.get('.p-datatable-tbody > :nth-child(2) > :nth-child(7)').should('contain', '$25.00');
    });
  });

  it('leapfrog and contact change', () => {
    setupTransactions(true).then((result: any) => {
      const transaction_c = buildScheduleA('INDIVIDUAL_RECEIPT', 40.0, '2025-04-20', result.individual, result.report);
      makeTransaction(transaction_c, () => {
        ReportListPage.goToReportList(result.report);
        cy.contains('Transactions in this report').should('exist');
        cy.get('.p-datatable-tbody > :nth-child(1) > :nth-child(2) > a').click();

        ContactLookup.getContact(result.individual2.last_name);

        // Tests moving the first transaction's date to be later than the second
        TransactionDetailPage.enterDate('[data-cy="contribution_date"]', new Date(currentYear, 3, 29), '');
        cy.get('h1').click(); // clicking outside of fields to ensure that the amount field loses focus and updates

        cy.get('[id=aggregate]').should('have.value', '$200.01');
        PageUtils.clickButton('Save');
        cy.contains('Confirm').should('exist');
        PageUtils.clickButton('Continue', '', true);

        cy.contains('Transactions in this report').should('exist');
        cy.get('.p-datatable-tbody > :nth-child(1) > :nth-child(7)').should('contain', '$200.01');
        cy.get('.p-datatable-tbody > :nth-child(2) > :nth-child(7)').should('contain', '$25.00');
        cy.get('.p-datatable-tbody > :nth-child(3) > :nth-child(7)').should('contain', '$65.00');
      });
    });
  });

  // TODO makeTransaction the first transactions
  it('existing IE date leapfrogging', () => {
    cy.wrap(DataSetup({ individual: true, individual2: true, candidate: true })).then((result: any) => {
      ReportListPage.goToReportList(result.report);
      // Create the first Independent Expenditure
      StartTransaction.Disbursements().Contributions().IndependentExpenditure();
      ContactLookup.getContact(result.individual.last_name, '', 'Individual');

      const independentExpenditureData: DisbursementFormData = {
        ...defaultTransactionFormData,
        ...{
          date_received: new Date(currentYear, 4 - 1, 5),
          supportOpposeCode: 'SUPPORT',
          amount: 100,
          signatoryDateSigned: new Date(currentYear, 4 - 1, 5),
          signatoryFirstName: faker.person.firstName(),
          signatoryLastName: faker.person.lastName(),
        },
      };

      TransactionDetailPage.enterSheduleFormDataForVoidExpenditure(
        independentExpenditureData,
        result.candidate,
        false,
        '',
        'date_signed',
      );

      cy.get('h1').click();
      cy.get('#calendar_ytd').should('have.value', '$100.00');
      PageUtils.clickButton('Save');
      cy.contains('Transactions in this report').should('exist');

      // Create the second Independent Expenditure
      StartTransaction.Disbursements().Contributions().IndependentExpenditure();
      ContactLookup.getContact(result.individual2.last_name, '', 'Individual');

      const independentExpenditureTwoData: DisbursementFormData = {
        ...defaultTransactionFormData,
        ...{
          date_received: new Date(currentYear, 4 - 1, 15),
          supportOpposeCode: 'SUPPORT',
          amount: 50,
          signatoryDateSigned: new Date(currentYear, 4 - 1, 15),
          signatoryFirstName: faker.person.firstName(),
          signatoryLastName: faker.person.lastName(),
        },
      };

      TransactionDetailPage.enterSheduleFormDataForVoidExpenditure(
        independentExpenditureTwoData,
        result.candidate,
        false,
        '',
        'date_signed',
      );

      cy.get('h1').click();
      cy.get('#calendar_ytd').should('have.value', '$150.00');
      PageUtils.clickButton('Save');
      cy.contains('Transactions in this report').should('exist');

      // Create the third Independent Expenditure
      StartTransaction.Disbursements().Contributions().IndependentExpenditure();
      ContactLookup.getContact(result.individual.last_name, '', 'Individual');

      const independentExpenditureThreeData: DisbursementFormData = {
        ...defaultTransactionFormData,
        ...{
          date_reveived: new Date(currentYear, 4 - 1, 27),
          supportOpposeCode: 'SUPPORT',
          amount: 25,
          signatoryDateSigned: new Date(currentYear, 4 - 1, 27),
          signatoryFirstName: faker.person.firstName(),
          signatoryLastName: faker.person.lastName(),
        },
      };

      TransactionDetailPage.enterSheduleFormDataForVoidExpenditure(
        independentExpenditureThreeData,
        result.candidate,
        false,
        '',
        'date_signed',
      );

      cy.get('h1').click();
      cy.get('#calendar_ytd').should('have.value', '$175.00');
      PageUtils.clickButton('Save');
      cy.contains('Transactions in this report').should('exist');

      // Test aggregation re-calculation from date leapfrogging
      cy.get('.p-datatable-tbody > :nth-child(1) > :nth-child(2) > a').click();
      cy.contains('Payee').should('exist');
      TransactionDetailPage.enterDate('[data-cy="disbursement_date"]', new Date(currentYear, 4 - 1, 20), '');
      cy.get('h1').click();
      cy.get('#calendar_ytd').should('have.value', '$150.00');
      PageUtils.clickButton('Save');
      cy.contains('Transactions in this report').should('exist');

      cy.get('.p-datatable-tbody > :nth-child(2) > :nth-child(2) > a').click();
      cy.contains('Payee').should('exist');
      cy.get('#calendar_ytd').should('have.value', '$50.00');
    });
  });
});