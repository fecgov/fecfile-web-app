import { ContactListPage } from '../pages/contactListPage';
import { Initialize } from '../pages/loginPage';
import { currentYear, PageUtils } from '../pages/pageUtils';
import { TransactionDetailPage } from '../pages/transactionDetailPage';
import { candidateFormData, defaultFormData as defaultContactFormData } from '../models/ContactFormModel';
import { F3XSetup } from './f3x-setup';
import { StartTransaction } from './utils/start-transaction/start-transaction';
import { defaultForm3XData } from '../models/ReportFormModel';
import {
  defaultScheduleFormData as defaultTransactionFormData,
  DisbursementFormData,
  formTransactionDataForSchedule,
} from '../models/TransactionFormModel';
import { faker } from '@faker-js/faker';
import { makeRequestToAPI } from '../requests/methods';
import { F3X_Q2 } from '../requests/library/reports';
import { buildScheduleA } from '../requests/library/transactions';
import { Individual_A_A, Individual_B_B } from '../requests/library/contacts';

describe('Tests transaction form aggregate calculation', () => {
  beforeEach(() => {
    Initialize();
  });

  it('new transaction aggregate', () => {
    cy.intercept('GET', 'http://localhost:8080/api/v1/transactions/**').as('GetTransactionList');
    makeRequestToAPI(
      'POST',
      'http://localhost:8080/api/v1/reports/form-3x/?fields_to_validate=filing_frequency',
      F3X_Q2,
      (response) => {
        const report_id: string = response.body.id;
        makeRequestToAPI('POST', 'http://localhost:8080/api/v1/contacts/', Individual_A_A, (response) => {
          const contact_A_A = response.body;
          const transaction_a = buildScheduleA('INDIVIDUAL_RECEIPT', 200.01, '2025-04-12', contact_A_A, report_id);
          const transaction_b = buildScheduleA('INDIVIDUAL_RECEIPT', 25.0, '2025-04-16', contact_A_A, report_id);
          makeRequestToAPI('POST', 'http://localhost:8080/api/v1/transactions/', transaction_a, (response) => {});
          makeRequestToAPI('POST', 'http://localhost:8080/api/v1/transactions/', transaction_b, (response) => {
            cy.visit(`/reports/transactions/report/${report_id}/list`);
          });
        });
      },
    );
    cy.wait('@GetTransactionList');

    cy.get(':nth-child(2) > :nth-child(2) > a').click();
    cy.contains('Create a new contact').should('exist');

    cy.get('h1').click(); // clicking outside of fields to ensure that the amount field loses focus and updates

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
    PageUtils.clickLink('Create a new contact');
    const secondIndividualFormContactData = {
      ...defaultContactFormData,
      ...{ contact_type: 'Individual', last_name: 'TESTO' },
    };
    ContactListPage.enterFormData(secondIndividualFormContactData, true);
    PageUtils.clickButton('Save & continue');
    cy.get('h1').click(); // clicking outside of fields to ensure that the amount field loses focus and updates

    cy.get('[id=aggregate]').should('have.value', '$25.00');

    // Change the contact back
    cy.get('[id="searchBox"]').type(Individual_A_A['last_name'].slice(0, 1));
    cy.contains('A, A').should('exist');
    cy.contains('A, A').click({ force: true });
    cy.get('h1').click(); // clicking outside of fields to ensure that the amount field loses focus and updates

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

  it('existing transaction change contact', () => {
    cy.intercept('GET', 'http://localhost:8080/api/v1/transactions/**').as('GetTransactionList');
    makeRequestToAPI(
      'POST',
      'http://localhost:8080/api/v1/reports/form-3x/?fields_to_validate=filing_frequency',
      F3X_Q2,
      (response) => {
        const report_id: string = response.body.id;
        makeRequestToAPI('POST', 'http://localhost:8080/api/v1/contacts/', Individual_A_A, (response) => {
          const contact_A_A = response.body;
          makeRequestToAPI('POST', 'http://localhost:8080/api/v1/contacts/', Individual_B_B, (response) => {
            const contact_B_B = response.body;
            const transaction_a = buildScheduleA('INDIVIDUAL_RECEIPT', 200.01, '2025-04-12', contact_A_A, report_id);
            const transaction_b = buildScheduleA('INDIVIDUAL_RECEIPT', 25.0, '2025-04-16', contact_B_B, report_id);
            makeRequestToAPI('POST', 'http://localhost:8080/api/v1/transactions/', transaction_a, (response) => {});
            makeRequestToAPI('POST', 'http://localhost:8080/api/v1/transactions/', transaction_b, (response) => {
              cy.visit(`/reports/transactions/report/${report_id}/list`);
            });
          });
        });
      },
    );
    cy.wait('@GetTransactionList');

    cy.contains('Transactions in this report').should('exist');
    cy.get('.p-datatable-tbody > :nth-child(2) > :nth-child(2) > a').click();

    // Tests changing the second transaction's contact
    cy.get('[id=aggregate]').should('have.value', '$25.00');
    cy.get('[id="searchBox"]').type('A');
    cy.contains('A, A').should('exist');
    cy.contains('A, A').click({ force: true });
    cy.get('h1').click(); // clicking outside of fields to ensure that the amount field loses focus and updates

    cy.get('[id=aggregate]').should('have.value', '$225.01');
    PageUtils.clickButton('Save');

    cy.contains('Transactions in this report').should('exist');
    cy.get('.p-datatable-tbody > :nth-child(1) > :nth-child(7)').should('contain', '$200.01');
    cy.get('.p-datatable-tbody > :nth-child(2) > :nth-child(7)').should('contain', '$225.01');
  });

  it('existing transaction change amount', () => {
    cy.intercept('GET', 'http://localhost:8080/api/v1/transactions/**').as('GetTransactionList');
    makeRequestToAPI(
      'POST',
      'http://localhost:8080/api/v1/reports/form-3x/?fields_to_validate=filing_frequency',
      F3X_Q2,
      (response) => {
        const report_id: string = response.body.id;
        makeRequestToAPI('POST', 'http://localhost:8080/api/v1/contacts/', Individual_A_A, (response) => {
          const contact_A_A = response.body;
          const transaction_a = buildScheduleA('INDIVIDUAL_RECEIPT', 200.01, '2025-04-12', contact_A_A, report_id);
          const transaction_b = buildScheduleA('INDIVIDUAL_RECEIPT', 25.0, '2025-04-16', contact_A_A, report_id);
          makeRequestToAPI('POST', 'http://localhost:8080/api/v1/transactions/', transaction_a, (response) => {});
          makeRequestToAPI('POST', 'http://localhost:8080/api/v1/transactions/', transaction_b, (response) => {
            cy.visit(`/reports/transactions/report/${report_id}/list`);
          });
        });
      },
    );
    cy.wait('@GetTransactionList');

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

  it('existing transaction date leapfrogging', () => {
    cy.intercept('GET', 'http://localhost:8080/api/v1/transactions/**').as('GetTransactionList');
    makeRequestToAPI(
      'POST',
      'http://localhost:8080/api/v1/reports/form-3x/?fields_to_validate=filing_frequency',
      F3X_Q2,
      (response) => {
        const report_id: string = response.body.id;
        makeRequestToAPI('POST', 'http://localhost:8080/api/v1/contacts/', Individual_A_A, (response) => {
          const contact_A_A = response.body;
          const transaction_a = buildScheduleA('INDIVIDUAL_RECEIPT', 200.01, '2025-04-12', contact_A_A, report_id);
          const transaction_b = buildScheduleA('INDIVIDUAL_RECEIPT', 25.0, '2025-04-16', contact_A_A, report_id);
          makeRequestToAPI('POST', 'http://localhost:8080/api/v1/transactions/', transaction_a, (response) => {});
          makeRequestToAPI('POST', 'http://localhost:8080/api/v1/transactions/', transaction_b, (response) => {
            cy.visit(`/reports/transactions/report/${report_id}/list`);
          });
        });
      },
    );
    cy.wait('@GetTransactionList');

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

  it('leapfrog and contact change', () => {
    cy.intercept('GET', 'http://localhost:8080/api/v1/transactions/**').as('GetTransactionList');
    makeRequestToAPI(
      'POST',
      'http://localhost:8080/api/v1/reports/form-3x/?fields_to_validate=filing_frequency',
      F3X_Q2,
      (response) => {
        const report_id: string = response.body.id;
        makeRequestToAPI('POST', 'http://localhost:8080/api/v1/contacts/', Individual_A_A, (response) => {
          const contact_A_A = response.body;
          const transaction_a = buildScheduleA('INDIVIDUAL_RECEIPT', 200.01, '2025-04-12', contact_A_A, report_id);
          const transaction_b = buildScheduleA('INDIVIDUAL_RECEIPT', 25.0, '2025-04-16', contact_A_A, report_id);
          const transaction_c = buildScheduleA('INDIVIDUAL_RECEIPT', 40.0, '2025-04-20', contact_A_A, report_id);
          makeRequestToAPI('POST', 'http://localhost:8080/api/v1/transactions/', transaction_a, (response) => {});
          makeRequestToAPI('POST', 'http://localhost:8080/api/v1/transactions/', transaction_b, (response) => {});
          makeRequestToAPI('POST', 'http://localhost:8080/api/v1/transactions/', transaction_c, (response) => {
            cy.visit(`/reports/transactions/report/${report_id}/list`);
          });
        });
      },
    );
    cy.wait('@GetTransactionList');

    cy.contains('Transactions in this report').should('exist');
    cy.get('.p-datatable-tbody > :nth-child(1) > :nth-child(2) > a').click();
    PageUtils.clickLink('Create a new contact');

    const secondIndividualFormContactData = {
      ...defaultContactFormData,
      ...{ contact_type: 'Individual', last_name: 'Z', first_name: 'Z' },
    };
    ContactListPage.enterFormData(secondIndividualFormContactData, true);
    PageUtils.clickButton('Save & continue');

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

  xit('existing IE date leapfrogging', () => {
    const individualFormContactData = {
      ...defaultContactFormData,
      ...{ contact_type: 'Individual', first_name: 'A', last_name: 'A' },
    };
    const individualTwoFormContactData = {
      ...defaultContactFormData,
      ...{ contact_type: 'Individual', first_name: 'Z', last_name: 'Z' },
    };

    cy.visit('/reports');
    ContactListPage.createIndividual(individualFormContactData);
    ContactListPage.createIndividual(individualTwoFormContactData);

    const f3x_report_data = {
      ...defaultForm3XData,
    };
    F3XSetup({ candidate: true, report: f3x_report_data });

    // Create the first Independent Expenditure
    StartTransaction.Disbursements().Independent().IndependentExpenditure();

    PageUtils.dropdownSetValue('#entity_type_dropdown', individualFormContactData.contact_type, '');
    cy.contains('LOOKUP').should('exist');
    cy.get('[id="searchBox"]').type(individualFormContactData.last_name.slice(0, 1));
    cy.contains('A, A').should('exist');
    cy.contains('A, A').click();

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
      candidateFormData,
      false,
      '',
      'date_signed',
    );

    cy.get('h1').click();
    cy.get('#calendar_ytd').should('have.value', '$100.00');
    PageUtils.clickButton('Save');
    cy.contains('Transactions in this report').should('exist');

    // Create the second Independent Expenditure
    StartTransaction.Disbursements().Independent().IndependentExpenditure();

    PageUtils.dropdownSetValue('#entity_type_dropdown', individualTwoFormContactData.contact_type, '');
    cy.contains('LOOKUP').should('exist');
    cy.get('[id="searchBox"]').type(individualTwoFormContactData.last_name.slice(0, 1));
    cy.contains('Z, Z').should('exist');
    cy.contains('Z, Z').click();

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
      candidateFormData,
      false,
      '',
      'date_signed',
    );

    cy.get('h1').click();
    cy.get('#calendar_ytd').should('have.value', '$150.00');
    PageUtils.clickButton('Save');
    cy.contains('Transactions in this report').should('exist');

    // Create the third Independent Expenditure
    StartTransaction.Disbursements().Independent().IndependentExpenditure();

    PageUtils.dropdownSetValue('#entity_type_dropdown', individualFormContactData.contact_type, '');
    cy.contains('LOOKUP').should('exist');
    cy.get('[id="searchBox"]').type(individualFormContactData.last_name.slice(0, 1));
    cy.contains('A, A').should('exist');
    cy.contains('A, A').click();

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
      candidateFormData,
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
