import { ContactListPage } from '../pages/contactListPage';
import { TransactionTableColumns } from '../pages/f3xTransactionListPage';
import { Initialize } from '../pages/loginPage';
import { currentYear, PageUtils } from '../pages/pageUtils';
import { TransactionDetailPage } from '../pages/transactionDetailPage';
import { defaultFormData as defaultContactFormData } from '../models/ContactFormModel';
import { defaultScheduleFormData, formTransactionDataForSchedule } from '../models/TransactionFormModel';
import { F3XSetup } from './f3x-setup';
import { StartTransaction } from './start-transaction/start-transaction';

const scheduleData = {
  ...defaultScheduleFormData,
  ...{
    electionYear: undefined,
    electionType: undefined,
    date_received: new Date(currentYear, 4 - 1, 27),
  },
};

function checkTable(index: number, type: string, containMemo: boolean, value: string) {
  cy.get('tbody tr').eq(index).as('row');
  cy.get('@row').find('td').eq(TransactionTableColumns.transaction_type).should('contain', type);
  cy.get('@row')
    .find('td')
    .eq(TransactionTableColumns.memo_code)
    .should(containMemo ? 'contain' : 'not.contain', 'Y');
  cy.get('@row').find('td').eq(TransactionTableColumns.aggregate).should('contain', value);
}

describe('Receipt Transactions', () => {
  beforeEach(() => {
    Initialize();
  });

  it('Create an Individual Receipt transaction using the contact lookup', () => {
    F3XSetup({ individual: true });
    StartTransaction.Receipts().Individual().IndividualReceipt();

    // Select the contact from the contact lookup
    cy.get('[id="searchBox"]').type(defaultContactFormData['last_name'].slice(0, 1));
    cy.contains(defaultContactFormData['last_name']).should('exist');
    cy.contains(defaultContactFormData['last_name']).click({ force: true });

    TransactionDetailPage.enterScheduleFormData(scheduleData, false, '', true, 'contribution_date');
    PageUtils.clickButton('Save');
    scheduleData.date_received = new Date(currentYear, 4 - 1, 27);
    cy.get('tr').should('contain', 'Individual Receipt');
    cy.get('tr').should('contain', 'Unitemized');
    cy.get('tr').should('contain', `${defaultContactFormData['last_name']}, ${defaultContactFormData['first_name']}`);
    cy.get('tr').should('contain', PageUtils.dateToString(scheduleData.date_received));
    cy.get('tr').should('contain', '$' + scheduleData.amount);

    // Check values of edit form
    PageUtils.clickLink('Individual Receipt');
    cy.get('#entity_type_dropdown.readonly').should('exist');
    cy.get('#entity_type_dropdown').should('contain', 'Individual');
    ContactListPage.assertFormData(defaultContactFormData, true);
    TransactionDetailPage.assertFormData(scheduleData, '', '#contribution_date');

    // Check for regression on date error
    cy.get('#contribution_date').clear();
    PageUtils.clickButton('Save'); // Triggers errors to show
    cy.get('app-calendar').should('exist').should('contain', 'This is a required field.');
  });

  it('Create a Returned/Bounced Receipt transaction with negative only amount', () => {
    F3XSetup();
    StartTransaction.Receipts().Individual().Returned();

    PageUtils.clickLink('Create a new contact');
    ContactListPage.enterFormData(defaultContactFormData, true);
    PageUtils.clickButton('Save & continue');
    const negativeAmountFormData = {
      ...formTransactionDataForSchedule,
      ...{
        amount: -100.55,
        date_received: new Date(currentYear, 4 - 1, 27),
        category_code: '',
      },
    };
    TransactionDetailPage.enterScheduleFormData(negativeAmountFormData, false, '', true, 'contribution_date');
    PageUtils.clickButton('Save');
    cy.contains('Confirm').should('exist');
    PageUtils.clickButton('Continue', '', true);

    cy.get('tr').should('contain', 'Returned/Bounced Receipt');
    cy.get('tr').should('not.contain', 'Unitemized');
    cy.get('tr').should('contain', `${defaultContactFormData['last_name']}, ${defaultContactFormData['first_name']}`);
    cy.get('tr').should('contain', PageUtils.dateToString(negativeAmountFormData.date_received));
    const amount =
      negativeAmountFormData.amount < 0 ? -1 * negativeAmountFormData.amount : negativeAmountFormData.amount;
    // Assert that the positive amount was converted to a negative amount
    cy.get('tr').should('contain', '-$' + amount);

    // Check values of edit form
    PageUtils.clickLink('Returned/Bounced Receipt');
    cy.get('#entity_type_dropdown.readonly').should('exist');
    cy.get('#entity_type_dropdown').should('contain', 'Individual');
    ContactListPage.assertFormData(defaultContactFormData, true);
    TransactionDetailPage.assertFormData(negativeAmountFormData, '', '#contribution_date');
  });

  it('Create a Partnership Receipt transaction and memos with correct aggregate values', () => {
    const formContactData = {
      ...defaultContactFormData,
      ...{ contact_type: 'Organization' },
    };
    const formTransactionData = {
      ...formTransactionDataForSchedule,
      ...{ purpose_description: '', category_code: '' },
    };
    ContactListPage.createOrganization(formContactData);
    F3XSetup({ individual: true });
    StartTransaction.Receipts().Individual().Partnership();
    PageUtils.searchBoxInput(formContactData.name);

    TransactionDetailPage.enterScheduleFormData(formTransactionData, false, '', true, 'contribution_date');
    const alias = PageUtils.getAlias('');
    cy.get(alias).find('[data-cy="navigation-control-dropdown"]').first().click();
    cy.get(alias).find('[data-cy="navigation-control-dropdown-option"]').first().click();

    // Create memo transaction
    cy.contains('h1', 'Partnership Attribution').should('exist');
    PageUtils.searchBoxInput(formContactData.first_name);
    PageUtils.clickButton('Save');
    const memoFormTransactionData = {
      ...formTransactionDataForSchedule,
      ...{ memo_code: true, purpose_description: '', category_code: '' },
    };

    TransactionDetailPage.enterScheduleFormData(memoFormTransactionData, false, '', true, 'contribution_date');
    cy.get('[data-cy="navigation-control-button"]').contains('button', 'Save').click();

    // Create a second memo transaction so we can check the aggregate value
    cy.contains('Transactions in this report').should('exist');
    PageUtils.clickLink('Partnership Receipt');
    cy.get(alias).find('[data-cy="navigation-control-dropdown"]').first().click();
    cy.get(alias).find('[data-cy="navigation-control-dropdown-option"]').first().click();
    PageUtils.urlCheck('PARTNERSHIP_ATTRIBUTION');
    cy.get('[id="searchBox"]').type(defaultContactFormData['last_name'].slice(0, 1));
    cy.contains(defaultContactFormData['last_name']).should('exist');
    cy.contains(defaultContactFormData['last_name']).click();
    TransactionDetailPage.enterScheduleFormData(memoFormTransactionData, false, '', true, 'contribution_date');

    cy.get('[data-cy="navigation-control-button"]').contains('button', 'Save').click();

    // Assert transaction list table is correct
    checkTable(0, 'Partnership Receipt', false, '$200.01');
    checkTable(1, 'Partnership Attribution', true, '$200.01');
    checkTable(2, 'Partnership Attribution', true, '$400.02');

    // Check form values of receipt form
    PageUtils.clickLink('Partnership Receipt');
    cy.get('#entity_type_dropdown.readonly').should('exist');
    cy.get('#entity_type_dropdown').should('contain', 'Organization');
    ContactListPage.assertFormData(formContactData, true);
    TransactionDetailPage.assertFormData(
      {
        ...formTransactionData,
        ...{ purpose_description: 'See Partnership Attribution(s) below' },
      },
      '',
      '#contribution_date',
    );
    PageUtils.clickButton('Cancel');
    PageUtils.urlCheck('/list');
    // Check form values of memo form
    PageUtils.clickLink('Partnership Attribution');
    cy.get('#entity_type_dropdown.readonly').should('exist');
    cy.get('#entity_type_dropdown').should('contain', 'Individual');
    ContactListPage.assertFormData(defaultContactFormData, true);
    TransactionDetailPage.assertFormData(
      {
        ...memoFormTransactionData,
        ...{ purpose_description: 'Partnership Attribution' },
      },
      '',
      '#contribution_date',
    );
  });

  it('Create a Party Receipt transaction', () => {
    F3XSetup();
    StartTransaction.Receipts().RegisteredFilers().Party();

    PageUtils.clickLink('Create a new contact');
    const formContactData = {
      ...defaultContactFormData,
      ...{ contact_type: 'Committee' },
    };
    ContactListPage.enterFormData(formContactData, true);
    PageUtils.clickButton('Save & continue');

    const localFormTransactionData = {
      ...formTransactionDataForSchedule,
      ...{
        category_code: '',
        date_received: new Date(currentYear, 4 - 1, 27),
      },
    };

    TransactionDetailPage.enterScheduleFormData(localFormTransactionData, false, '', true, 'contribution_date');
    PageUtils.clickButton('Save');
    cy.contains('Confirm').should('exist');
    PageUtils.clickButton('Continue', '', true);

    cy.get('tr').should('contain', 'Party Receipt');
    cy.get('tr').should('not.contain', 'Unitemized');
    cy.get('tr').should('contain', formContactData['name']);
    cy.get('tr').should('contain', PageUtils.dateToString(localFormTransactionData.date_received));
    cy.get('tr').should('contain', '$' + localFormTransactionData.amount);

    // Check values of edit form
    PageUtils.clickLink('Party Receipt');
    cy.get('#entity_type_dropdown.readonly').should('exist');
    cy.get('#entity_type_dropdown').should('contain', 'Committee');
    ContactListPage.assertFormData(formContactData, true);
    TransactionDetailPage.assertFormData(localFormTransactionData, '', '#contribution_date');
  });

  it('Create a Group I transaction', () => {
    F3XSetup();
    StartTransaction.Receipts().Refunds().ContributionToOtherPoliticalCommittee();

    PageUtils.clickLink('Create a new contact');
    const formContactData = {
      ...defaultContactFormData,
      ...{ contact_type: 'Committee' },
    };
    ContactListPage.enterFormData(formContactData, true);
    PageUtils.clickButton('Save & continue');

    const transactionFormData = {
      ...formTransactionDataForSchedule,
      ...{
        category_code: '',
        date_received: new Date(currentYear, 4 - 1, 27),
      },
    };
    TransactionDetailPage.enterScheduleFormData(transactionFormData, false, '', true, 'contribution_date');
    PageUtils.clickButton('Save');
    cy.contains('Confirm').should('exist');
    PageUtils.clickButton('Continue', '', true);

    cy.get('tr').should('contain', 'Refund of Contribution to Other Political Committee');
    cy.get('tr').should('not.contain', 'Unitemized');
    cy.get('tr').should('contain', formContactData['name']);
    cy.get('tr').should('contain', PageUtils.dateToString(transactionFormData.date_received));
    cy.get('tr').should('contain', '$' + transactionFormData['amount']);

    // Check values of edit form
    PageUtils.clickLink('Refund of Contribution to Other Political Committee');
    cy.get('#entity_type_dropdown.readonly').should('exist');
    cy.get('#entity_type_dropdown').should('contain', 'Committee');
    ContactListPage.assertFormData(formContactData, true);
    TransactionDetailPage.assertFormData(transactionFormData, '', '#contribution_date');
  });

  it('Create a dual-entry Earmark Receipt transaction', () => {
    F3XSetup();
    StartTransaction.Receipts().Individual().Earmark();

    // Enter STEP ONE transaction
    cy.get('p-accordion-panel').first().as('stepOneAccordion');
    PageUtils.clickLink('Create a new contact', '@stepOneAccordion');
    ContactListPage.enterFormData(defaultContactFormData, true, '@stepOneAccordion');
    PageUtils.clickButton('Save & continue', '@stepOneAccordion');
    const transactionFormData = {
      ...formTransactionDataForSchedule,
      ...{
        purpose_description: '',
        category_code: '',
        date_received: new Date(currentYear, 4 - 1, 27),
      },
    };
    TransactionDetailPage.enterScheduleFormData(
      transactionFormData,
      false,
      '@stepOneAccordion',
      true,
      'contribution_date',
    );

    // Enter STEP TWO transaction
    PageUtils.clickAccordion('STEP TWO');
    cy.get('p-accordion-panel').last().as('stepTwoAccordion');
    PageUtils.clickLink('Create a new contact', '@stepTwoAccordion');
    const stepTwoContactFormData = { ...defaultContactFormData, ...{ contact_type: 'Committee' } };
    ContactListPage.enterFormData(stepTwoContactFormData, true, '@stepTwoAccordion');
    PageUtils.clickButton('Save & continue', '@stepTwoAccordion');
    TransactionDetailPage.enterScheduleFormData(
      transactionFormData,
      true,
      '@stepTwoAccordion',
      true,
      'contribution_date',
    );

    PageUtils.clickButton('Save');
    cy.contains('Confirm').should('exist');
    PageUtils.clickButton('Continue', '', true);
    cy.contains('Confirm').should('exist').wait(500);
    PageUtils.clickButton('Continue', '', true);

    // Assert transaction list table is correct
    cy.get('tbody tr').eq(0).as('row-1');
    cy.get('@row-1').find('td').eq(TransactionTableColumns.transaction_type).should('contain', 'Earmark Receipt');
    cy.get('@row-1')
      .find('td')
      .eq(TransactionTableColumns.name)
      .should('contain', `${defaultContactFormData['last_name']}, ${defaultContactFormData['first_name']}`);
    cy.get('@row-1').find('td').eq(TransactionTableColumns.memo_code).should('not.contain', 'Y');
    cy.get('@row-1').find('td').eq(TransactionTableColumns.aggregate).should('contain', '$200.01');

    cy.get('tbody tr').eq(1).as('row-2');
    cy.get('@row-2').find('td').eq(TransactionTableColumns.transaction_type).should('contain', 'Earmark Memo');
    cy.get('@row-2').find('td').eq(TransactionTableColumns.name).should('contain', defaultContactFormData['name']);
    cy.get('@row-2').find('td').eq(TransactionTableColumns.memo_code).should('contain', 'Y');
    cy.get('@row-2').find('td').eq(TransactionTableColumns.aggregate).should('contain', '$200.01');

    // Check form values of receipt edit form
    PageUtils.clickLink('Earmark Receipt');
    cy.get('@stepOneAccordion').find('#entity_type_dropdown.readonly').should('exist');
    cy.get('@stepOneAccordion').find('#entity_type_dropdown').should('contain', 'Individual');
    ContactListPage.assertFormData(defaultContactFormData, true, '@stepOneAccordion');
    TransactionDetailPage.assertFormData(
      {
        ...transactionFormData,
        ...{ purpose_description: `Earmarked through ${defaultContactFormData['name']}` },
      },
      '@stepOneAccordion',
      '#contribution_date',
    );

    // Check form values of memo edit form
    PageUtils.clickAccordion('STEP TWO');
    cy.get('@stepTwoAccordion').find('#entity_type_dropdown.readonly').should('exist');
    cy.get('@stepTwoAccordion').find('#entity_type_dropdown').should('contain', 'Committee');
    ContactListPage.assertFormData(stepTwoContactFormData, true, '@stepTwoAccordion');
    TransactionDetailPage.assertFormData(
      {
        ...transactionFormData,
        ...{ memo_code: true, purpose_description: 'Total earmarked through conduit.' },
      },
      '@stepTwoAccordion',
      '#contribution_date',
    );
  });

  it('Create a dual-entry PAC Earmark Receipt transaction', () => {
    F3XSetup();
    StartTransaction.Receipts().RegisteredFilers().PAC();

    // Enter STEP ONE transaction
    cy.get('p-accordion-panel').first().as('stepOneAccordion');
    PageUtils.clickLink('Create a new contact', '@stepOneAccordion');
    const stepOneContactFormData = { ...defaultContactFormData, ...{ contact_type: 'Committee' } };
    ContactListPage.enterFormData(stepOneContactFormData, true, '@stepOneAccordion');
    PageUtils.clickButton('Save & continue', '@stepOneAccordion');

    const transactionFormData = {
      ...formTransactionDataForSchedule,
      ...{
        purpose_description: '',
        category_code: '',
        date_received: new Date(currentYear, 4 - 1, 27),
      },
    };
    TransactionDetailPage.enterScheduleFormData(
      transactionFormData,
      false,
      '@stepOneAccordion',
      true,
      'contribution_date',
    );

    // Enter STEP TWO transaction
    PageUtils.clickAccordion('STEP TWO');
    cy.get('p-accordion-panel').last().as('stepTwoAccordion');
    PageUtils.dropdownSetValue('#entity_type_dropdown', 'Individual', '@stepTwoAccordion');
    PageUtils.clickLink('Create a new contact', '@stepTwoAccordion');
    ContactListPage.enterFormData(defaultContactFormData, true, '@stepTwoAccordion');
    PageUtils.clickButton('Save & continue', '@stepTwoAccordion');
    TransactionDetailPage.enterScheduleFormData(
      transactionFormData,
      true,
      '@stepTwoAccordion',
      true,
      'contribution_date',
    );

    PageUtils.clickButton('Save');
    cy.contains('Confirm').should('exist');
    PageUtils.clickButton('Continue', '', true);
    cy.contains('Confirm').should('exist').wait(500);
    PageUtils.clickButton('Continue', '', true);

    // Assert transaction list table is correct
    cy.get('tbody tr').eq(0).as('row-1');
    cy.get('@row-1').find('td').eq(TransactionTableColumns.transaction_type).should('contain', 'PAC Earmark Receipt');
    cy.get('@row-1').find('td').eq(TransactionTableColumns.name).should('contain', defaultContactFormData['name']);
    cy.get('@row-1').find('td').eq(TransactionTableColumns.memo_code).should('not.contain', 'Y');
    cy.get('@row-1').find('td').eq(TransactionTableColumns.aggregate).should('contain', '$200.01');

    cy.get('tbody tr').eq(1).as('row-2');
    cy.get('@row-2').find('td').eq(TransactionTableColumns.transaction_type).should('contain', 'PAC Earmark Memo');
    cy.get('@row-2')
      .find('td')
      .eq(TransactionTableColumns.name)
      .should('contain', `${stepOneContactFormData['last_name']}, ${stepOneContactFormData['first_name']}`);
    cy.get('@row-2').find('td').eq(TransactionTableColumns.memo_code).should('contain', 'Y');
    cy.get('@row-2').find('td').eq(TransactionTableColumns.aggregate).should('contain', '$200.01');

    // Check form values of receipt edit form
    PageUtils.clickLink('PAC Earmark Receipt');
    PageUtils.clickAccordion('STEP ONE');
    cy.get('@stepOneAccordion').find('#entity_type_dropdown.readonly').should('exist');
    cy.get('@stepOneAccordion').find('#entity_type_dropdown').should('contain', 'Committee');
    ContactListPage.assertFormData(stepOneContactFormData, true, '@stepOneAccordion');
    TransactionDetailPage.assertFormData(
      {
        ...transactionFormData,
        ...{
          purpose_description: `Earmarked through ${defaultContactFormData['first_name']} ${defaultContactFormData['last_name']}`,
        },
      },
      '@stepOneAccordion',
      '#contribution_date',
    );

    // Check form values of memo edit form
    PageUtils.clickAccordion('STEP TWO');
    cy.get('@stepTwoAccordion').find('#entity_type_dropdown.readonly').should('exist');
    cy.get('@stepTwoAccordion').find('#entity_type_dropdown').should('contain', 'Individual');
    ContactListPage.assertFormData(defaultContactFormData, true, '@stepTwoAccordion');
    TransactionDetailPage.assertFormData(
      {
        ...transactionFormData,
        ...{ memo_code: true, purpose_description: 'Total earmarked through conduit.' },
      },
      '@stepTwoAccordion',
      '#contribution_date',
    );
  });

  it('Create a Joint Fundraising Transfer transaction with Tier 3 child transactions', () => {
    F3XSetup();

    // Create a Joint Fundraising Transfer
    StartTransaction.Receipts().Transfers().JointFundraising();

    PageUtils.clickLink('Create a new contact');
    const committeeFormContactData = {
      ...defaultContactFormData,
      ...{ contact_type: 'Committee' },
    };
    ContactListPage.enterFormData(committeeFormContactData, true);
    PageUtils.clickButton('Save & continue');

    const tier1TransactionData = {
      ...formTransactionDataForSchedule,
      ...{
        purpose_description: '',
        category_code: '',
        date_received: new Date(currentYear, 4 - 1, 27),
      },
    };
    TransactionDetailPage.enterScheduleFormData(tier1TransactionData, false, '', true, 'contribution_date');
    const alias = PageUtils.getAlias('');
    cy.get(alias).find('[data-cy="navigation-control-dropdown"]').first().click();
    cy.get(alias).find('[data-cy="navigation-control-dropdown-option"]').contains('Partnership Receipt').click();
    cy.contains('Confirm').should('exist');
    PageUtils.clickButton('Continue', '', true);

    // Create Partnership Receipt Joint Fundraising Transfer Memo
    cy.contains('h1', 'Partnership Receipt Joint Fundraising Transfer Memo').should('exist');
    PageUtils.clickLink('Create a new contact');
    const organizationFormContactData = {
      ...defaultContactFormData,
      ...{ contact_type: 'Organization' },
    };
    ContactListPage.enterFormData(organizationFormContactData, true);
    PageUtils.clickButton('Save & continue');
    const tier2TransactionData = {
      ...formTransactionDataForSchedule,
      ...{
        purpose_description: '',
        category_code: '',
        date_received: new Date(currentYear, 4 - 1, 27),
      },
    };
    TransactionDetailPage.enterScheduleFormData(tier2TransactionData, false, '', true, 'contribution_date');
    cy.get(alias).find('[data-cy="navigation-control-dropdown"]').first().click();
    cy.get(alias).find('[data-cy="navigation-control-dropdown-option"]').contains('Individual').click();
    cy.contains('Confirm').should('exist');
    PageUtils.clickButton('Continue', '', true);

    // Create Partnership Individual Joint Fundraising Transfer Memo
    cy.contains('h1', 'Individual Joint Fundraising Transfer Memo').should('exist');
    PageUtils.clickLink('Create a new contact');
    const individualFormContactData = {
      ...defaultContactFormData,
      ...{ contact_type: 'Individual' },
    };
    ContactListPage.enterFormData(individualFormContactData, true);
    PageUtils.clickButton('Save & continue');
    const tier3TransactionData = {
      ...formTransactionDataForSchedule,
      ...{
        purpose_description: '',
        category_code: '',
        date_received: new Date(currentYear, 4 - 1, 27),
      },
    };
    TransactionDetailPage.enterScheduleFormData(tier3TransactionData, false, '', true, 'contribution_date');
    cy.get('[data-cy="navigation-control-button"]').contains('button', 'Save').click();
    cy.contains('Confirm').should('exist');
    PageUtils.clickButton('Continue', '', true);

    // Assert transaction list table is correct
    cy.get('tbody tr').eq(0).as('row-1');
    cy.get('@row-1')
      .find('td')
      .as('joint_fundraising_transfer_link')
      .eq(TransactionTableColumns.transaction_type)
      .should('contain', 'Joint Fundraising Transfer');
    cy.get('@row-1').find('td').eq(TransactionTableColumns.memo_code).should('not.contain', 'Y');
    cy.get('@row-1').find('td').eq(TransactionTableColumns.aggregate).should('contain', '$200.01');

    cy.get('tbody tr').eq(1).as('row-2');
    cy.get('@row-2')
      .find('td')
      .eq(TransactionTableColumns.transaction_type)
      .should('contain', 'Partnership Receipt Joint Fundraising Transfer Memo');
    cy.get('@row-2').find('td').eq(TransactionTableColumns.memo_code).should('contain', 'Y');
    cy.get('@row-2').find('td').eq(TransactionTableColumns.aggregate).should('contain', '$200.01');

    cy.get('tbody tr').eq(2).as('row-3');
    cy.get('@row-3')
      .find('td')
      .eq(TransactionTableColumns.transaction_type)
      .should('contain', 'Individual Joint Fundraising Transfer Memo');
    cy.get('@row-3').find('td').eq(TransactionTableColumns.memo_code).should('contain', 'Y');
    cy.get('@row-3').find('td').eq(TransactionTableColumns.aggregate).should('contain', '$200.01');

    // Check form values of receipt form
    PageUtils.clickLink('Joint Fundraising Transfer', '@joint_fundraising_transfer_link');
    cy.get('#entity_type_dropdown.readonly').should('exist');
    cy.get('#entity_type_dropdown').should('contain', 'Committee');
    ContactListPage.assertFormData(committeeFormContactData, true);
    TransactionDetailPage.assertFormData(
      {
        ...tier1TransactionData,
        ...{ purpose_description: 'Transfer of Joint Fundraising Proceeds' },
      },
      '',
      '#contribution_date',
    );
    PageUtils.clickButton('Cancel');
  });

  it('calculates the aggregate amount within a transaction form', () => {
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
    cy.get('h1').click(); // clicking outside of fields to ensure that the amount field loses focus and updates

    cy.get('[id=aggregate]').should('have.value', '$225.01');

    TransactionDetailPage.enterDate('[data-cy="contribution_date"]', new Date(currentYear, 3, 26), '');
    cy.get('h1').click(); // clicking outside of fields to ensure that the amount field loses focus and updates

    cy.get('[id=aggregate]').should('have.value', '$25.00');
  });
});
