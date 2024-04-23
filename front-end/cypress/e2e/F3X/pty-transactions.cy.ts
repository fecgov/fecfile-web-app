import { ContactListPage } from '../pages/contactListPage';
import { TransactionTableColumns } from '../pages/f3xTransactionListPage';
import { Initialize, setCommitteeType } from '../pages/loginPage';
import { currentYear, PageUtils } from '../pages/pageUtils';
import { TransactionDetailPage } from '../pages/transactionDetailPage';
import { defaultFormData as defaultContactFormData, organizationFormData } from '../models/ContactFormModel';
import { defaultScheduleFormData, formTransactionDataForSchedule } from '../models/TransactionFormModel';
import { F3XSetup } from './f3x-setup';
import { StartTransaction } from './start-transaction/start-transaction';
import { faker } from '@faker-js/faker';

const scheduleData = {
  ...defaultScheduleFormData,
  ...{
    electionYear: undefined,
    electionType: undefined,
    date_received: new Date(currentYear, 4 - 1, 27),
  },
};

describe('PTY Transactions', () => {
  beforeEach(() => {
    Initialize();
  });

  it('Create a Credit Card Payment for 100% Federal Election Activity transaction', () => {
    F3XSetup({ organization: true });
    setCommitteeType('X');
    StartTransaction.Disbursements().Federal().CreditCardPayment();

    cy.get('[id="searchBox"]').type(organizationFormData.name.slice(0, 1));
    cy.contains(organizationFormData.name).should('exist');
    cy.contains(organizationFormData.name).click();

    const transactionFormData = {
      ...formTransactionDataForSchedule,
      ...{
        electionType: 'General',
        electionYear: 2024,
        election_other_description: faker.lorem.sentence({ min: 1, max: 2 }),
        purpose_description: '',
        category_code: '',
        date_received: new Date(currentYear, 4 - 1, 27),
      },
    };
    TransactionDetailPage.enterScheduleFormData(transactionFormData, false, '', false);
    cy.get('[data-test="navigation-control-button"]').contains('button', 'Save').click();

    cy.get('tr').should('contain', 'Credit Card Payment for 100% Federal Election Activity');
    cy.get('tr').should('contain', organizationFormData['name']);
    cy.get('tr').should('contain', PageUtils.dateToString(transactionFormData.date_received));
    cy.get('tr').should('contain', '$' + transactionFormData.amount);

    // Check values of edit form
    PageUtils.clickLink('Credit Card Payment for 100% Federal Election Activity');
    cy.get('#entity_type_dropdown > div.readonly').should('exist');
    cy.get('#entity_type_dropdown').should('contain', 'Organization');
    ContactListPage.assertFormData(organizationFormData, true);
    TransactionDetailPage.assertFormData(transactionFormData);
  });

  it('Create a dual-entry Earmark Receipt transaction', () => {
    F3XSetup();
    StartTransaction.Receipts().Individual().Earmark();

    // Enter STEP ONE transaction
    cy.get('p-accordiontab').first().as('stepOneAccordion');
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
    TransactionDetailPage.enterScheduleFormData(transactionFormData, false, '@stepOneAccordion');

    // Enter STEP TWO transaction
    PageUtils.clickLink('STEP TWO');
    cy.get('p-accordiontab').last().as('stepTwoAccordion');
    PageUtils.clickLink('Create a new contact', '@stepTwoAccordion');
    const stepTwoContactFormData = { ...defaultContactFormData, ...{ contact_type: 'Committee' } };
    ContactListPage.enterFormData(stepTwoContactFormData, true, '@stepTwoAccordion');
    PageUtils.clickButton('Save & continue', '@stepTwoAccordion');
    TransactionDetailPage.enterScheduleFormData(transactionFormData, true, '@stepTwoAccordion');

    PageUtils.clickButton('Save');
    cy.contains('Confirm').should('exist');
    PageUtils.clickButton('Continue');
    cy.contains('Confirm').should('exist').wait(500);
    PageUtils.clickButton('Continue');

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
    cy.get('@stepOneAccordion').find('#entity_type_dropdown > div.readonly').should('exist');
    cy.get('@stepOneAccordion').find('#entity_type_dropdown').should('contain', 'Individual');
    ContactListPage.assertFormData(defaultContactFormData, true, '@stepOneAccordion');
    TransactionDetailPage.assertFormData(
      {
        ...transactionFormData,
        ...{ purpose_description: `Earmarked through ${defaultContactFormData['name']}` },
      },
      '@stepOneAccordion',
    );

    // Check form values of memo edit form
    PageUtils.clickLink('STEP TWO');
    cy.get('@stepTwoAccordion').find('#entity_type_dropdown > div.readonly').should('exist');
    cy.get('@stepTwoAccordion').find('#entity_type_dropdown').should('contain', 'Committee');
    ContactListPage.assertFormData(stepTwoContactFormData, true, '@stepTwoAccordion');
    TransactionDetailPage.assertFormData(
      {
        ...transactionFormData,
        ...{ memo_code: true, purpose_description: 'Total earmarked through conduit.' },
      },
      '@stepTwoAccordion',
    );
  });

  it('Create a dual-entry PAC Earmark Receipt transaction', () => {
    F3XSetup();
    StartTransaction.Receipts().RegisteredFilers().PAC();

    // Enter STEP ONE transaction
    cy.get('p-accordiontab').first().as('stepOneAccordion');
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
    TransactionDetailPage.enterScheduleFormData(transactionFormData, false, '@stepOneAccordion');

    // Enter STEP TWO transaction
    PageUtils.clickLink('STEP TWO');
    cy.get('p-accordiontab').last().as('stepTwoAccordion');
    PageUtils.dropdownSetValue('#entity_type_dropdown', 'Individual', '@stepTwoAccordion');
    PageUtils.clickLink('Create a new contact', '@stepTwoAccordion');
    ContactListPage.enterFormData(defaultContactFormData, true, '@stepTwoAccordion');
    PageUtils.clickButton('Save & continue', '@stepTwoAccordion');
    TransactionDetailPage.enterScheduleFormData(transactionFormData, true, '@stepTwoAccordion');

    PageUtils.clickButton('Save');
    cy.contains('Confirm').should('exist');
    PageUtils.clickButton('Continue');
    cy.contains('Confirm').should('exist').wait(500);
    PageUtils.clickButton('Continue');

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
    PageUtils.clickLink('STEP ONE');
    cy.get('@stepOneAccordion').find('#entity_type_dropdown > div.readonly').should('exist');
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
    );

    // Check form values of memo edit form
    PageUtils.clickLink('STEP TWO');
    cy.get('@stepTwoAccordion').find('#entity_type_dropdown > div.readonly').should('exist');
    cy.get('@stepTwoAccordion').find('#entity_type_dropdown').should('contain', 'Individual');
    ContactListPage.assertFormData(defaultContactFormData, true, '@stepTwoAccordion');
    TransactionDetailPage.assertFormData(
      {
        ...transactionFormData,
        ...{ memo_code: true, purpose_description: 'Total earmarked through conduit.' },
      },
      '@stepTwoAccordion',
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
    TransactionDetailPage.enterScheduleFormData(tier1TransactionData);
    const alias = PageUtils.getAlias('');
    cy.get(alias).find('[data-test="navigation-control-dropdown"]').first().click();
    cy.get(alias).find('[data-test="navigation-control-dropdown-option"]').contains('Partnership Receipt').click();
    cy.contains('Confirm').should('exist');
    PageUtils.clickButton('Continue');

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
    TransactionDetailPage.enterScheduleFormData(tier2TransactionData);
    cy.get(alias).find('[data-test="navigation-control-dropdown"]').first().click();
    cy.get(alias).find('[data-test="navigation-control-dropdown-option"]').contains('Individual').click();
    cy.contains('Confirm').should('exist');
    PageUtils.clickButton('Continue');

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
    TransactionDetailPage.enterScheduleFormData(tier3TransactionData);
    cy.get('[data-test="navigation-control-button"]').contains('button', 'Save').click();
    cy.contains('Confirm').should('exist');
    PageUtils.clickButton('Continue');

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
    cy.get('#entity_type_dropdown > div.readonly').should('exist');
    cy.get('#entity_type_dropdown').should('contain', 'Committee');
    ContactListPage.assertFormData(committeeFormContactData, true);
    TransactionDetailPage.assertFormData({
      ...tier1TransactionData,
      ...{ purpose_description: 'Transfer of Joint Fundraising Proceeds' },
    });
    PageUtils.clickButton('Cancel');
  });
});
