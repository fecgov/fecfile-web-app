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
import { F3XAggregationHelpers } from '../../e2e-extended/f3x/f3x-aggregation.helpers';

function setupTransactions(secondSame: boolean) {
  return cy.wrap(DataSetup({ individual: true, individual2: true })).then((result: any) => {
    const transaction_a = buildScheduleA(
      'INDIVIDUAL_RECEIPT',
      200.01,
      `${currentYear}-04-12`,
      result.individual,
      result.report,
    );
    const transaction_b = buildScheduleA(
      'INDIVIDUAL_RECEIPT',
      25,
      `${currentYear}-04-16`,
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

      cy.get(`${F3XAggregationHelpers.receiptsTableRoot} .p-datatable-tbody > tr`)
        .eq(1) // 0-based, so 2nd row
        .find('td')
        .eq(1) // 2nd cell
        .find('a')
        .first()
        .click();
      cy.contains('Create a new contact').should('exist');

      cy.get('[id=aggregate]').should('have.value', '$225.01');

      // Tests moving the date to be earlier
      TransactionDetailPage.enterDate('[data-cy="contribution_date"]', new Date(currentYear, 3, 10), '');
      PageUtils.blurActiveField(); // clicking outside of fields to ensure that the amount field loses focus and updates
      cy.get('[id=aggregate]').should('have.value', '$25.00');

      // Move the date back
      TransactionDetailPage.enterDate('[data-cy="contribution_date"]', new Date(currentYear, 3, 30), '');
      PageUtils.blurActiveField();
      cy.get('[id=aggregate]').should('have.value', '$225.01');

      // Change the contact
      ContactLookup.getContact(result.individual2.last_name);
      cy.get('[id=aggregate]').should('have.value', '$25.00');

      // Change the contact back
      ContactLookup.getContact(result.individual.last_name);
      cy.get('[id=aggregate]').should('have.value', '$225.01');

      // Change the amount
      cy.get('[id="amount"]').clear().safeType('40');
      PageUtils.blurActiveField();
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
      cy.get(`${F3XAggregationHelpers.receiptsTableRoot} .p-datatable-tbody > :nth-child(2) > :nth-child(2) > a`)
        .first()
        .click();

      // Tests changing the second transaction's contact
      cy.get('[id=aggregate]').should('have.value', '$25.00');
      cy.get('[data-cy="searchBox"]').type('A');
      cy.contains('Ant').should('exist');
      cy.get('.p-autocomplete-list-container:visible')
        .contains('.p-autocomplete-option', 'Ant')
        .first()
        .click();
      PageUtils.blurActiveField();

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
      cy.get(`${F3XAggregationHelpers.receiptsTableRoot} .p-datatable-tbody > :nth-child(2) > :nth-child(2) > a`)
        .first()
        .click();

      // Tests changing the amount
      cy.get('[id=aggregate]').should('have.value', '$225.01');
      cy.get('[id="amount"]').clear().safeType('40');
      PageUtils.blurActiveField();

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
      cy.get(`${F3XAggregationHelpers.receiptsTableRoot} .p-datatable-tbody > :nth-child(1) > :nth-child(2) > a`)
        .first()
        .click();

      // Tests moving the first transaction's date to be later than the second
      TransactionDetailPage.enterDate('[data-cy="contribution_date"]', new Date(currentYear, 3, 30), '');
      PageUtils.blurActiveField();

      cy.get('[id=aggregate]').should('have.value', '$225.01');
      PageUtils.clickButton('Save');

      cy.contains('Transactions in this report').should('exist');
      cy.get('.p-datatable-tbody > :nth-child(1) > :nth-child(7)').should('contain', '$225.01');
      cy.get('.p-datatable-tbody > :nth-child(2) > :nth-child(7)').should('contain', '$25.00');
    });
  });

  it('leapfrog and contact change', () => {
    setupTransactions(true).then((result: any) => {
      const transaction_c = buildScheduleA(
        'INDIVIDUAL_RECEIPT',
        40,
        `${currentYear}-04-20`,
        result.individual,
        result.report,
      );
      makeTransaction(transaction_c).then(() => {
        ReportListPage.goToReportList(result.report);
        cy.contains('Transactions in this report').should('exist');
        cy.get(`${F3XAggregationHelpers.receiptsTableRoot} .p-datatable-tbody > :nth-child(1) > :nth-child(2) > a`)
          .first()
          .click();

        ContactLookup.getContact(result.individual2.last_name);

        // Tests moving the first transaction's date to be later than the second
        TransactionDetailPage.enterDate('[data-cy="contribution_date"]', new Date(currentYear, 3, 29), '');
        PageUtils.blurActiveField();

        cy.get('[id=aggregate]').should('have.value', '$200.01');
        PageUtils.clickButton('Save');

        cy.contains('Transactions in this report').should('exist');
        cy.get('.p-datatable-tbody > :nth-child(1) > :nth-child(7)').should('contain', '$200.01');
        cy.get('.p-datatable-tbody > :nth-child(2) > :nth-child(7)').should('contain', '$25.00');
        cy.get('.p-datatable-tbody > :nth-child(3) > :nth-child(7)').should('contain', '$65.00');
      });
    });
  });

  it('existing IE date leapfrogging', () => {
    cy.wrap(DataSetup({ individual: true, individual2: true, candidate: true })).then((result: any) => {
      ReportListPage.goToReportList(result.report);

      // Create the first Independent Expenditure
      StartTransaction.Disbursements().Contributions().IndependentExpenditure();
      ContactLookup.getContact(result.individual.last_name, '', 'Individual');

      const independentExpenditureData: DisbursementFormData = {
        ...defaultTransactionFormData,
        date_received: new Date(currentYear, 4 - 1, 5),
        supportOpposeCode: 'SUPPORT',
        amount: 100,
        signatoryDateSigned: new Date(currentYear, 4 - 1, 5),
        signatoryFirstName: faker.person.firstName(),
        signatoryLastName: faker.person.lastName(),
      };

      TransactionDetailPage.enterSheduleFormDataForVoidExpenditure(
        independentExpenditureData,
        result.candidate,
        false,
        '',
        'date_signed',
      );

      PageUtils.blurActiveField();
      cy.get('#calendar_ytd').should('have.value', '$100.00');
      PageUtils.clickButton('Save');
      cy.contains('Transactions in this report').should('exist');

      // Create the second Independent Expenditure
      StartTransaction.Disbursements().Contributions().IndependentExpenditure();
      ContactLookup.getContact(result.individual2.last_name, '', 'Individual');

      const independentExpenditureTwoData: DisbursementFormData = {
        ...defaultTransactionFormData,
        date_received: new Date(currentYear, 4 - 1, 15),
        supportOpposeCode: 'SUPPORT',
        amount: 50,
        signatoryDateSigned: new Date(currentYear, 4 - 1, 15),
        signatoryFirstName: faker.person.firstName(),
        signatoryLastName: faker.person.lastName(),
      };

      TransactionDetailPage.enterSheduleFormDataForVoidExpenditure(
        independentExpenditureTwoData,
        result.candidate,
        false,
        '',
        'date_signed',
      );

      PageUtils.blurActiveField();
      cy.get('#calendar_ytd').should('have.value', '$150.00');
      PageUtils.clickButton('Save');
      cy.contains('Transactions in this report').should('exist');

      // Create the third Independent Expenditure
      StartTransaction.Disbursements().Contributions().IndependentExpenditure();
      ContactLookup.getContact(result.individual.last_name, '', 'Individual');

      const independentExpenditureThreeData: DisbursementFormData = {
        ...defaultTransactionFormData,
        date_received: new Date(currentYear, 4 - 1, 27),
        supportOpposeCode: 'SUPPORT',
        amount: 25,
        signatoryDateSigned: new Date(currentYear, 4 - 1, 27),
        signatoryFirstName: faker.person.firstName(),
        signatoryLastName: faker.person.lastName(),
      };

      TransactionDetailPage.enterSheduleFormDataForVoidExpenditure(
        independentExpenditureThreeData,
        result.candidate,
        false,
        '',
        'date_signed',
      );

      PageUtils.blurActiveField();
      cy.get('#calendar_ytd').should('have.value', '$175.00');
      PageUtils.clickButton('Save');
      cy.contains('Transactions in this report').should('exist');

      // Test aggregation re-calculation from date leapfrogging
      cy.get(`${F3XAggregationHelpers.disbursementsTableRoot} .p-datatable-tbody > :nth-child(1) > :nth-child(2) > a`)
        .first()
        .click();
      cy.contains('Payee').should('exist');
      TransactionDetailPage.enterDate('[data-cy="disbursement_date"]', new Date(currentYear, 4 - 1, 20), '');
      PageUtils.blurActiveField();
      cy.get('#calendar_ytd').should('have.value', '$150.00');
      PageUtils.clickButton('Save');
      cy.contains('Transactions in this report').should('exist');

      cy.get(`${F3XAggregationHelpers.disbursementsTableRoot} .p-datatable-tbody > :nth-child(2) > :nth-child(2) > a`)
        .first()
        .click();
      cy.contains('Payee').should('exist');
      cy.get('#calendar_ytd').should('have.value', '$50.00');
    });
  });

  it('schedule A delete earliest transaction reaggregates remaining chain', () => {
    cy.wrap(DataSetup({ individual: true })).then((result: any) => {
      F3XAggregationHelpers.seedScheduleAChain(result.report, result.individual, [
        { amount: 100, date: `${currentYear}-04-10` },
        { amount: 50, date: `${currentYear}-04-15` },
        { amount: 25, date: `${currentYear}-04-20` },
      ]).then((transactionIds) => {
        const [firstId, secondId, thirdId] = transactionIds;

        F3XAggregationHelpers.goToReport(result.report);
        F3XAggregationHelpers.assertReceiptAggregate(secondId, '$150.00');
        F3XAggregationHelpers.assertReceiptAggregate(thirdId, '$175.00');

        F3XAggregationHelpers.clickRowActionById(F3XAggregationHelpers.receiptsTableRoot, firstId, 'Delete');
        F3XAggregationHelpers.confirmDialog();

          cy.get(`${F3XAggregationHelpers.receiptsTableRoot} a[href*="/list/${firstId}"]`).should('not.exist');
        F3XAggregationHelpers.assertReceiptAggregate(secondId, '$50.00');
        F3XAggregationHelpers.assertReceiptAggregate(thirdId, '$75.00');
      });
    });
  });

  it('schedule A insert middle-date transaction does not double-count downstream aggregate', () => {
    cy.wrap(DataSetup({ individual: true })).then((result: any) => {
      F3XAggregationHelpers.seedScheduleAChain(result.report, result.individual, [
        { amount: 100, date: `${currentYear}-04-10` },
        { amount: 150, date: `${currentYear}-04-20` },
      ]).then((seedIds) => {
        const [firstId, lastId] = seedIds;
        F3XAggregationHelpers.createTransaction(
          buildScheduleA('INDIVIDUAL_RECEIPT', 75, `${currentYear}-04-15`, result.individual, result.report),
        ).then((middleTransaction) => {
          F3XAggregationHelpers.goToReport(result.report);
          F3XAggregationHelpers.assertReceiptAggregate(firstId, '$100.00');
          F3XAggregationHelpers.assertReceiptAggregate(middleTransaction.id, '$175.00');
          F3XAggregationHelpers.assertReceiptAggregate(lastId, '$325.00');
        });
      });
    });
  });

  it('schedule E delete transaction reaggregates calendar_ytd_per_election_office', () => {
    cy.wrap(DataSetup({ individual: true, candidate: true })).then((result: any) => {
      F3XAggregationHelpers.createIndependentExpenditureViaUI({
        reportId: result.report,
        payeeContactName: result.individual.last_name,
        candidate: result.candidate,
        amount: 100,
        disbursementDate: new Date(currentYear, 4 - 1, 5),
      }).then((firstId) => {
        F3XAggregationHelpers.createIndependentExpenditureViaUI({
          reportId: result.report,
          payeeContactName: result.individual.last_name,
          candidate: result.candidate,
          amount: 50,
          disbursementDate: new Date(currentYear, 4 - 1, 20),
        }).then((secondId) => {
          F3XAggregationHelpers.goToReport(result.report);
          F3XAggregationHelpers.openRowById(F3XAggregationHelpers.disbursementsTableRoot, secondId);
          cy.get('#calendar_ytd').should('have.value', '$150.00');
          F3XAggregationHelpers.clickSave();

          F3XAggregationHelpers.clickRowActionById(F3XAggregationHelpers.disbursementsTableRoot, firstId, 'Delete');
          F3XAggregationHelpers.confirmDialog();

          F3XAggregationHelpers.openRowById(F3XAggregationHelpers.disbursementsTableRoot, secondId);
          cy.get('#calendar_ytd').should('have.value', '$50.00');
        });
      });
    });
  });
});
