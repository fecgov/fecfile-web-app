import { ContactListPage } from '../pages/contactListPage';
import { Initialize } from '../pages/loginPage';
import { currentYear, PageUtils } from '../pages/pageUtils';
import { TransactionDetailPage } from '../pages/transactionDetailPage';
import { defaultFormData as defaultContactFormData } from '../models/ContactFormModel';
import { formTransactionDataForSchedule } from '../models/TransactionFormModel';
import { F3XSetup } from './f3x-setup';
import { StartTransaction } from './start-transaction/start-transaction';

describe('Tests transaction form aggregate calculation', () => {
  beforeEach(() => {
    Initialize();
  });

  it('new transaction aggregate', () => {
    F3XSetup();

    // Create the first Individual Receipt
    StartTransaction.Receipts().Individual().IndividualReceipt();

    PageUtils.clickLink('Create a new contact');
    const individualFormContactData = {
      ...defaultContactFormData,
      ...{ contact_type: 'Individual' },
    };
    ContactListPage.enterFormData(individualFormContactData, true);
    PageUtils.clickButton('Save & continue');

    const transactionOneData = {
      ...formTransactionDataForSchedule,
      ...{
        purpose_description: '',
        category_code: '',
        date_received: new Date(currentYear, 3, 27),
      },
    };
    TransactionDetailPage.enterScheduleFormData(transactionOneData, false, '', true, 'contribution_date');
    PageUtils.clickButton('Save');
    cy.contains('Confirm').should('exist');
    PageUtils.clickButton('Continue', '', true);

    cy.contains('Transactions in this report').should('exist');

    // Create the second Individual Receipt
    StartTransaction.Receipts().Individual().IndividualReceipt();
    cy.get('[id="searchBox"]').type(defaultContactFormData['last_name'].slice(0, 1));
    cy.contains(defaultContactFormData['last_name']).should('exist');
    cy.contains(defaultContactFormData['last_name']).click({ force: true });

    const transactionTwoData = {
      ...formTransactionDataForSchedule,
      ...{
        purpose_description: '',
        category_code: '',
        date_received: new Date(currentYear, 3, 28),
        amount: 25,
      },
    };

    // Tests with a later date
    TransactionDetailPage.enterScheduleFormData(transactionTwoData, false, '', true, 'contribution_date');
    cy.get('h1').click(); // clicking outside of fields to ensure that the amount field loses focus and updates

    cy.get('[id=aggregate]').should('have.value', '$225.01');

    // Tests moving the date to be earlier
    TransactionDetailPage.enterDate('[data-cy="contribution_date"]', new Date(currentYear, 3, 26), '');
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
    cy.get('[id="searchBox"]').type(defaultContactFormData['last_name'].slice(0, 1));
    cy.contains(defaultContactFormData['last_name']).should('exist');
    cy.contains(defaultContactFormData['last_name']).click({ force: true });
    cy.get('h1').click(); // clicking outside of fields to ensure that the amount field loses focus and updates

    cy.get('[id=aggregate]').should('have.value', '$225.01');

    // Change the amount
    cy.get('[id="amount"]').clear().safeType('40');
    cy.get('h1').click(); // clicking outside of fields to ensure that the amount field loses focus and updates

    cy.get('[id=aggregate]').should('have.value', '$240.01');
  });

  // Disabled pending the fix that should come with #2087
  xit('existing transaction date leapfrogging', () => {
    F3XSetup();

    // Create the first Individual Receipt
    StartTransaction.Receipts().Individual().IndividualReceipt();

    PageUtils.clickLink('Create a new contact');
    const individualFormContactData = {
      ...defaultContactFormData,
      ...{ contact_type: 'Individual' },
    };
    ContactListPage.enterFormData(individualFormContactData, true);
    PageUtils.clickButton('Save & continue');

    const transactionOneData = {
      ...formTransactionDataForSchedule,
      ...{
        purpose_description: '',
        category_code: '',
        date_received: new Date(currentYear, 3, 27),
      },
    };
    TransactionDetailPage.enterScheduleFormData(transactionOneData, false, '', true, 'contribution_date');
    PageUtils.clickButton('Save');
    cy.contains('Confirm').should('exist');
    PageUtils.clickButton('Continue', '', true);

    cy.contains('Transactions in this report').should('exist');

    // Create the second Individual Receipt
    StartTransaction.Receipts().Individual().IndividualReceipt();
    cy.get('[id="searchBox"]').type(defaultContactFormData['last_name'].slice(0, 1));
    cy.contains(defaultContactFormData['last_name']).should('exist');
    cy.contains(defaultContactFormData['last_name']).click({ force: true });

    const transactionTwoData = {
      ...formTransactionDataForSchedule,
      ...{
        purpose_description: '',
        category_code: '',
        date_received: new Date(currentYear, 3, 28),
        amount: 25,
      },
    };
    TransactionDetailPage.enterScheduleFormData(transactionTwoData, false, '', true, 'contribution_date');
    PageUtils.clickButton('Save');
    cy.contains('Confirm').should('exist');
    PageUtils.clickButton('Continue', '', true);

    cy.contains('Transactions in this report').should('exist');
    cy.get('.p-datatable-tbody > :nth-child(1) > :nth-child(2) > a').click();

    // Tests moving the first transaction's date to be later than the second
    TransactionDetailPage.enterDate('[data-cy="contribution_date"]', new Date(currentYear, 3, 30), '');
    cy.get('h1').click(); // clicking outside of fields to ensure that the amount field loses focus and updates

    cy.get('[id=aggregate]').should('have.value', '$225.01');
  });

  it('existing transaction change contact', () => {
    F3XSetup();

    // Create the first Individual Receipt
    StartTransaction.Receipts().Individual().IndividualReceipt();

    PageUtils.clickLink('Create a new contact');
    const individualFormContactData = {
      ...defaultContactFormData,
      ...{ contact_type: 'Individual', last_name: 'A', first_name: 'A' },
    };
    ContactListPage.enterFormData(individualFormContactData, true);
    PageUtils.clickButton('Save & continue');

    const transactionOneData = {
      ...formTransactionDataForSchedule,
      ...{
        purpose_description: '',
        category_code: '',
        date_received: new Date(currentYear, 3, 27),
      },
    };
    TransactionDetailPage.enterScheduleFormData(transactionOneData, false, '', true, 'contribution_date');
    PageUtils.clickButton('Save');
    cy.contains('Confirm').should('exist');
    PageUtils.clickButton('Continue', '', true);

    cy.contains('Transactions in this report').should('exist');

    // Create the second Individual Receipt
    StartTransaction.Receipts().Individual().IndividualReceipt();
    PageUtils.clickLink('Create a new contact');
    const secondIndividualFormContactData = {
      ...defaultContactFormData,
      ...{ contact_type: 'Individual', last_name: 'Z', first_name: 'Z' },
    };
    ContactListPage.enterFormData(secondIndividualFormContactData, true);
    PageUtils.clickButton('Save & continue');

    const transactionTwoData = {
      ...formTransactionDataForSchedule,
      ...{
        purpose_description: '',
        category_code: '',
        date_received: new Date(currentYear, 3, 28),
        amount: 25,
      },
    };
    TransactionDetailPage.enterScheduleFormData(transactionTwoData, false, '', true, 'contribution_date');
    PageUtils.clickButton('Save');
    cy.contains('Confirm').should('exist');
    PageUtils.clickButton('Continue', '', true);

    cy.contains('Transactions in this report').should('exist');
    cy.get('.p-datatable-tbody > :nth-child(2) > :nth-child(2) > a').click();

    // Tests changing the second transaction's contact
    cy.get('[id=aggregate]').should('have.value', '$25.00');
    cy.get('[id="searchBox"]').type('A');
    cy.contains('A, A').should('exist');
    cy.contains('A, A').click({ force: true });
    cy.get('h1').click(); // clicking outside of fields to ensure that the amount field loses focus and updates

    cy.get('[id=aggregate]').should('have.value', '$225.01');
  });

  it('existing transaction change amount', () => {
    F3XSetup();

    // Create the first Individual Receipt
    StartTransaction.Receipts().Individual().IndividualReceipt();

    PageUtils.clickLink('Create a new contact');
    const individualFormContactData = {
      ...defaultContactFormData,
      ...{ contact_type: 'Individual' },
    };
    ContactListPage.enterFormData(individualFormContactData, true);
    PageUtils.clickButton('Save & continue');

    const transactionOneData = {
      ...formTransactionDataForSchedule,
      ...{
        purpose_description: '',
        category_code: '',
        date_received: new Date(currentYear, 3, 27),
      },
    };
    TransactionDetailPage.enterScheduleFormData(transactionOneData, false, '', true, 'contribution_date');
    PageUtils.clickButton('Save');
    cy.contains('Confirm').should('exist');
    PageUtils.clickButton('Continue', '', true);

    cy.contains('Transactions in this report').should('exist');

    // Create the second Individual Receipt
    StartTransaction.Receipts().Individual().IndividualReceipt();
    cy.get('[id="searchBox"]').type(defaultContactFormData['last_name'].slice(0, 1));
    cy.contains(defaultContactFormData['last_name']).should('exist');
    cy.contains(defaultContactFormData['last_name']).click({ force: true });

    const transactionTwoData = {
      ...formTransactionDataForSchedule,
      ...{
        purpose_description: '',
        category_code: '',
        date_received: new Date(currentYear, 3, 28),
        amount: 25,
      },
    };
    TransactionDetailPage.enterScheduleFormData(transactionTwoData, false, '', true, 'contribution_date');
    PageUtils.clickButton('Save');
    cy.contains('Confirm').should('exist');
    PageUtils.clickButton('Continue', '', true);

    cy.contains('Transactions in this report').should('exist');
    cy.get('.p-datatable-tbody > :nth-child(2) > :nth-child(2) > a').click();

    // Tests changing the amount
    cy.get('[id=aggregate]').should('have.value', '$225.01');
    cy.get('[id="amount"]').clear().safeType('40');
    cy.get('h1').click(); // clicking outside of fields to ensure that the amount field loses focus and updates

    cy.get('[id=aggregate]').should('have.value', '$240.01');
  });
});
