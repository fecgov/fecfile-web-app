import { ContactListPage, defaultFormData as defaultContactFormData } from './pages/contactListPage';
import { defaultFormData as defaultReportFormData, F3xCreateReportPage } from './pages/f3xCreateReportPage';
import { TransactionTableColumns } from './pages/f3xTransactionListPage';
import { LoginPage } from './pages/loginPage';
import { PageUtils } from './pages/pageUtils';
import { ReportListPage } from './pages/reportListPage';
import { defaultFormData as defaultTransactionFormData, TransactionDetailPage } from './pages/transactionDetailPage';

describe('Transactions', () => {
  beforeEach(() => {
    LoginPage.login();
    ContactListPage.deleteAllContacts();
    ReportListPage.deleteAllReports();
    ReportListPage.goToPage();
  });

  it('Create a Group A transaction using a contact lookup', () => {
    cy.runLighthouse('reports', 'transactions-list');

    // Create an individual contact to be used with contact lookup
    ContactListPage.goToPage();
    PageUtils.clickButton('New');
    ContactListPage.enterFormData(defaultContactFormData);
    PageUtils.clickButton('Save');

    ReportListPage.goToPage();
    ReportListPage.clickCreateButton();
    F3xCreateReportPage.enterFormData(defaultReportFormData);
    PageUtils.clickButton('Save and continue');

    PageUtils.clickSidebarItem('Add a receipt');
    PageUtils.clickLink('CONTRIBUTIONS FROM INDIVIDUALS/PERSONS');
    PageUtils.clickLink('Individual Receipt');

    // Select the contact from the contact lookup
    cy.get('[role="searchbox"]').type(defaultContactFormData['last_name'].slice(0, 1));
    cy.contains(defaultContactFormData['last_name']).should('exist');
    cy.contains(defaultContactFormData['last_name']).click();

    TransactionDetailPage.enterFormData(defaultTransactionFormData);
    PageUtils.clickButton('Save');

    cy.get('tr').should('contain', 'Individual Receipt');
    cy.get('tr').should('contain', 'Unitemized');
    cy.get('tr').should('contain', `${defaultContactFormData['last_name']}, ${defaultContactFormData['first_name']}`);
    cy.get('tr').should('contain', PageUtils.dateToString(defaultTransactionFormData['date_received']));
    cy.get('tr').should('contain', '$' + defaultTransactionFormData['amount']);

    // Check values of edit form
    PageUtils.clickLink('Individual Receipt');
    cy.get('#entity_type_dropdown > div.readonly').should('exist');
    cy.get('#entity_type_dropdown').should('contain', 'Individual');
    ContactListPage.assertFormData(defaultContactFormData, true);
    TransactionDetailPage.assertFormData(defaultTransactionFormData);

    cy.runLighthouse('reports', 'single-transaction');
  });

  it('Create a Group B transaction', () => {
    ReportListPage.clickCreateButton();
    F3xCreateReportPage.enterFormData(defaultReportFormData);
    PageUtils.clickButton('Save and continue');

    PageUtils.clickSidebarItem('Add a disbursement');
    PageUtils.clickLink('OTHER EXPENDITURES');
    PageUtils.clickLink('Other Disbursement');

    PageUtils.clickLink('Create a new contact');
    const formContactData = {
      ...defaultContactFormData,
      ...{ contact_type: 'Organization' },
    };
    ContactListPage.enterFormData(formContactData, true);
    PageUtils.clickButton('Save & continue');

    const formTransactionData = {
      ...defaultTransactionFormData,
      ...{ amount: 200.01, category_code: '005 Polling Expenses' },
    };
    TransactionDetailPage.enterFormData(formTransactionData);
    PageUtils.clickButton('Save');
    cy.contains('Confirm').should('exist');
    PageUtils.clickButton('Continue');

    cy.get('tr').should('contain', 'Other Disbursement');
    cy.get('tr').should('not.contain', 'Unitemized');
    cy.get('tr').should('contain', formContactData['name']);
    cy.get('tr').should('contain', PageUtils.dateToString(formTransactionData['date_received']));
    cy.get('tr').should('contain', '$' + formTransactionData['amount']);

    // Check values of edit form
    PageUtils.clickLink('Other Disbursement');
    cy.get('#entity_type_dropdown > div.readonly').should('exist');
    cy.get('#entity_type_dropdown').should('contain', 'Organization');
    ContactListPage.assertFormData(formContactData, true);
    TransactionDetailPage.assertFormData(formTransactionData);
  });

  it('Create a Group C transaction with negative only amount', () => {
    ReportListPage.clickCreateButton();
    F3xCreateReportPage.enterFormData(defaultReportFormData);
    PageUtils.clickButton('Save and continue');

    PageUtils.clickSidebarItem('Add a receipt');
    PageUtils.clickLink('CONTRIBUTIONS FROM INDIVIDUALS/PERSONS');
    PageUtils.clickLink('Returned/Bounced Receipt');

    PageUtils.clickLink('Create a new contact');
    ContactListPage.enterFormData(defaultContactFormData, true);
    PageUtils.clickButton('Save & continue');

    TransactionDetailPage.enterFormData(defaultTransactionFormData);
    PageUtils.clickButton('Save');
    cy.contains('Confirm').should('exist');
    PageUtils.clickButton('Continue');

    cy.get('tr').should('contain', 'Returned/Bounced Receipt');
    cy.get('tr').should('not.contain', 'Unitemized');
    cy.get('tr').should('contain', `${defaultContactFormData['last_name']}, ${defaultContactFormData['first_name']}`);
    cy.get('tr').should('contain', PageUtils.dateToString(defaultTransactionFormData['date_received']));

    // Assert that the positive amount was converted to a negative amount
    cy.get('tr').should('contain', '-$' + defaultTransactionFormData['amount']);

    // Check values of edit form
    PageUtils.clickLink('Returned/Bounced Receipt');
    cy.get('#entity_type_dropdown > div.readonly').should('exist');
    cy.get('#entity_type_dropdown').should('contain', 'Individual');
    ContactListPage.assertFormData(defaultContactFormData, true);
    TransactionDetailPage.assertFormData({ ...defaultTransactionFormData, ...{ amount: -100.55 } });
  });

  it('Create a Group D transaction and memos with correct aggregate values', () => {
    ReportListPage.clickCreateButton();
    F3xCreateReportPage.enterFormData(defaultReportFormData);
    PageUtils.clickButton('Save and continue');

    // Create a receipt
    PageUtils.clickSidebarItem('Add a receipt');
    PageUtils.clickLink('CONTRIBUTIONS FROM INDIVIDUALS/PERSONS');
    PageUtils.clickLink('Partnership Receipt');

    PageUtils.clickLink('Create a new contact');
    const formContactData = {
      ...defaultContactFormData,
      ...{ contact_type: 'Organization' },
    };
    ContactListPage.enterFormData(formContactData, true);
    PageUtils.clickButton('Save & continue');

    const formTransactionData = {
      ...defaultTransactionFormData,
      ...{ purpose_description: '' },
    };
    TransactionDetailPage.enterFormData(formTransactionData);
    PageUtils.dropdownSetValue('[data-test="navigation-control-dropdown"]', 'Partnership Attribution');
    cy.contains('Confirm').should('exist');
    PageUtils.clickButton('Continue');

    // Create memo transaction
    cy.contains('h1', 'Partnership Attribution').should('exist');
    PageUtils.clickLink('Create a new contact');
    ContactListPage.enterFormData(defaultContactFormData, true);
    PageUtils.clickButton('Save & continue');
    const memoFormTransactionData = {
      ...defaultTransactionFormData,
      ...{ memo_code: true, purpose_description: '' },
    };
    TransactionDetailPage.enterFormData(memoFormTransactionData);
    PageUtils.clickButton('Save');
    cy.contains('Confirm').should('exist');
    PageUtils.clickButton('Continue');

    // Create a second memo transaction so we can check the aggregate value
    cy.contains('Transactions in this report').should('exist');
    PageUtils.clickLink('Partnership Receipt');
    PageUtils.dropdownSetValue('[data-test="navigation-control-dropdown"]', 'Partnership Attribution');
    cy.contains('Partnership Attribution').wait(500);
    cy.get('[role="searchbox"]').type(defaultContactFormData['last_name'].slice(0, 1));
    cy.contains(defaultContactFormData['last_name']).should('exist');
    cy.contains(defaultContactFormData['last_name']).click();
    TransactionDetailPage.enterFormData(memoFormTransactionData);
    PageUtils.clickButton('Save');

    // Assert transaction list table is correct
    cy.get('tbody tr').eq(0).as('row-1');
    cy.get('@row-1')
      .find('td')
      .eq(TransactionTableColumns.transaction_type)
      .should('contain', 'Partnership Attribution');
    cy.get('@row-1').find('td').eq(TransactionTableColumns.transaction_type).should('contain', 'Unitemized');
    cy.get('@row-1').find('td').eq(TransactionTableColumns.memo_code).should('contain', 'Y');
    cy.get('@row-1').find('td').eq(TransactionTableColumns.aggregate).should('contain', '$201.10');

    cy.get('tbody tr').eq(1).as('row-2');
    cy.get('@row-2').find('td').eq(TransactionTableColumns.transaction_type).should('contain', 'Partnership Receipt');
    cy.get('@row-2').find('td').eq(TransactionTableColumns.transaction_type).should('contain', 'Unitemized');
    cy.get('@row-2').find('td').eq(TransactionTableColumns.memo_code).should('not.contain', 'Y');
    cy.get('@row-2').find('td').eq(TransactionTableColumns.aggregate).should('contain', '$100.55');

    cy.get('tbody tr').eq(2).as('row-3');
    cy.get('@row-3')
      .find('td')
      .eq(TransactionTableColumns.transaction_type)
      .should('contain', 'Partnership Attribution');
    cy.get('@row-3').find('td').eq(TransactionTableColumns.transaction_type).should('contain', 'Unitemized');
    cy.get('@row-3').find('td').eq(TransactionTableColumns.memo_code).should('contain', 'Y');
    cy.get('@row-3').find('td').eq(TransactionTableColumns.aggregate).should('contain', '$100.55');

    // Check form values of receipt form
    PageUtils.clickLink('Partnership Receipt');
    cy.get('#entity_type_dropdown > div.readonly').should('exist');
    cy.get('#entity_type_dropdown').should('contain', 'Organization');
    ContactListPage.assertFormData(formContactData, true);
    TransactionDetailPage.assertFormData({
      ...formTransactionData,
      ...{ purpose_description: 'See Partnership Attribution(s) below' },
    });
    PageUtils.clickButton('Cancel');

    // Check form values of memo form
    cy.get('tbody tr').first().contains('a', 'Partnership Attribution').click();
    cy.get('#entity_type_dropdown > div.readonly').should('exist');
    cy.get('#entity_type_dropdown').should('contain', 'Individual');
    ContactListPage.assertFormData(defaultContactFormData, true);
    TransactionDetailPage.assertFormData({
      ...memoFormTransactionData,
      ...{ purpose_description: 'Partnership Attribution' },
    });
  });

  it('Create a Group E transaction', () => {
    ReportListPage.clickCreateButton();
    F3xCreateReportPage.enterFormData(defaultReportFormData);
    PageUtils.clickButton('Save and continue');

    PageUtils.clickSidebarItem('Add a receipt');
    PageUtils.clickLink('CONTRIBUTIONS FROM REGISTERED FILERS');
    PageUtils.clickLink('Party Receipt');

    PageUtils.clickLink('Create a new contact');
    const formContactData = {
      ...defaultContactFormData,
      ...{ contact_type: 'Committee' },
    };
    ContactListPage.enterFormData(formContactData, true);
    PageUtils.clickButton('Save & continue');

    TransactionDetailPage.enterFormData(defaultTransactionFormData);
    PageUtils.clickButton('Save');
    cy.contains('Confirm').should('exist');
    PageUtils.clickButton('Continue');

    cy.get('tr').should('contain', 'Party Receipt');
    cy.get('tr').should('not.contain', 'Unitemized');
    cy.get('tr').should('contain', formContactData['name']);
    cy.get('tr').should('contain', PageUtils.dateToString(defaultTransactionFormData['date_received']));
    cy.get('tr').should('contain', '$' + defaultTransactionFormData['amount']);

    // Check values of edit form
    PageUtils.clickLink('Party Receipt');
    cy.get('#entity_type_dropdown > div.readonly').should('exist');
    cy.get('#entity_type_dropdown').should('contain', 'Committee');
    ContactListPage.assertFormData(formContactData, true);
    TransactionDetailPage.assertFormData(defaultTransactionFormData);
  });

  it('Create a Group I transaction', () => {
    ReportListPage.clickCreateButton();
    F3xCreateReportPage.enterFormData(defaultReportFormData);
    PageUtils.clickButton('Save and continue');

    PageUtils.clickSidebarItem('Add a receipt');
    PageUtils.clickLink('REFUNDS');
    PageUtils.clickLink('Refund of Contribution to Other Political Committee');

    PageUtils.clickLink('Create a new contact');
    const formContactData = {
      ...defaultContactFormData,
      ...{ contact_type: 'Committee' },
    };
    ContactListPage.enterFormData(formContactData, true);
    PageUtils.clickButton('Save & continue');

    const transactionFormData = {
      ...defaultTransactionFormData,
    };
    TransactionDetailPage.enterFormData(transactionFormData);
    PageUtils.clickButton('Save');
    cy.contains('Confirm').should('exist');
    PageUtils.clickButton('Continue');

    cy.get('tr').should('contain', 'Refund of Contribution to Other Political Committee');
    cy.get('tr').should('not.contain', 'Unitemized');
    cy.get('tr').should('contain', formContactData['name']);
    cy.get('tr').should('contain', PageUtils.dateToString(transactionFormData['date_received']));
    cy.get('tr').should('contain', '$' + transactionFormData['amount']);

    // Check values of edit form
    PageUtils.clickLink('Refund of Contribution to Other Political Committee');
    cy.get('#entity_type_dropdown > div.readonly').should('exist');
    cy.get('#entity_type_dropdown').should('contain', 'Committee');
    ContactListPage.assertFormData(formContactData, true);
    TransactionDetailPage.assertFormData(transactionFormData);
  });

  it('Create a Group M transaction', () => {
    ReportListPage.clickCreateButton();
    F3xCreateReportPage.enterFormData(defaultReportFormData);
    PageUtils.clickButton('Save and continue');

    PageUtils.clickSidebarItem('Add a disbursement');
    PageUtils.clickLink('FEDERAL ELECTION ACTIVITY EXPENDITURES');
    PageUtils.clickLink('Credit Card Payment for 100% Federal Election Activity');

    PageUtils.clickLink('Create a new contact');
    const formContactData = {
      ...defaultContactFormData,
      ...{ contact_type: 'Organization' },
    };
    ContactListPage.enterFormData(formContactData, true);
    PageUtils.clickButton('Save & continue');

    const transactionFormData = {
      ...defaultTransactionFormData,
      ...{
        electionType: 'General',
        electionYear: 2024,
        election_other_description: PageUtils.randomString(10),
      },
      ...{ purpose_description: '' },
    };
    TransactionDetailPage.enterFormData(transactionFormData);
    PageUtils.clickButton('Save');
    cy.contains('Confirm').should('exist');
    PageUtils.clickButton('Continue');

    cy.get('tr').should('contain', 'Credit Card Payment for 100% Federal Election Activity');
    cy.get('tr').should('contain', 'Unitemized');
    cy.get('tr').should('contain', formContactData['name']);
    cy.get('tr').should('contain', PageUtils.dateToString(transactionFormData['date_received']));
    cy.get('tr').should('contain', '$' + transactionFormData['amount']);

    // Check values of edit form
    PageUtils.clickLink('Credit Card Payment for 100% Federal Election Activity');
    cy.get('#entity_type_dropdown > div.readonly').should('exist');
    cy.get('#entity_type_dropdown').should('contain', 'Organization');
    ContactListPage.assertFormData(formContactData, true);
    TransactionDetailPage.assertFormData(transactionFormData);
  });

  it('Create a Group AG transaction', () => {
    ReportListPage.clickCreateButton();
    F3xCreateReportPage.enterFormData(defaultReportFormData);
    PageUtils.clickButton('Save and continue');

    PageUtils.clickSidebarItem('Add a receipt');
    PageUtils.clickLink('CONTRIBUTIONS FROM INDIVIDUALS/PERSONS');
    PageUtils.clickLink('Earmark Receipt');

    // Enter STEP ONE transaction
    cy.get('p-accordiontab').first().as('stepOneAccordion');
    PageUtils.clickLink('Create a new contact', '@stepOneAccordion');
    ContactListPage.enterFormData(defaultContactFormData, true, '@stepOneAccordion');
    PageUtils.clickButton('Save & continue', '@stepOneAccordion');
    const transactionFormData = {
      ...defaultTransactionFormData,
      ...{
        purpose_description: '',
      },
    };
    TransactionDetailPage.enterFormData(transactionFormData, false, '@stepOneAccordion');

    // Enter STEP TWO transaction
    PageUtils.clickLink('STEP TWO');
    cy.get('p-accordiontab').last().as('stepTwoAccordion');
    PageUtils.clickLink('Create a new contact', '@stepTwoAccordion');
    const stepTwoContactFormData = { ...defaultContactFormData, ...{ contact_type: 'Committee' } };
    ContactListPage.enterFormData(stepTwoContactFormData, true, '@stepTwoAccordion');
    PageUtils.clickButton('Save & continue', '@stepTwoAccordion');
    TransactionDetailPage.enterFormData(transactionFormData, true, '@stepTwoAccordion');

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
    cy.get('@row-1').find('td').eq(TransactionTableColumns.aggregate).should('contain', '$100.55');

    cy.get('tbody tr').eq(1).as('row-2');
    cy.get('@row-2').find('td').eq(TransactionTableColumns.transaction_type).should('contain', 'Earmark Memo');
    cy.get('@row-2').find('td').eq(TransactionTableColumns.name).should('contain', defaultContactFormData['name']);
    cy.get('@row-2').find('td').eq(TransactionTableColumns.memo_code).should('contain', 'Y');
    cy.get('@row-2').find('td').eq(TransactionTableColumns.aggregate).should('contain', '$100.55');

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
      '@stepOneAccordion'
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
      '@stepTwoAccordion'
    );
  });

  it('Create a Group FG transaction', () => {
    ReportListPage.clickCreateButton();
    F3xCreateReportPage.enterFormData(defaultReportFormData);
    PageUtils.clickButton('Save and continue');

    PageUtils.clickSidebarItem('Add a receipt');
    PageUtils.clickLink('CONTRIBUTIONS FROM REGISTERED FILERS');
    PageUtils.clickLink('PAC Earmark Receipt');

    // Enter STEP ONE transaction
    cy.get('p-accordiontab').first().as('stepOneAccordion');
    PageUtils.clickLink('Create a new contact', '@stepOneAccordion');
    const stepOneContactFormData = { ...defaultContactFormData, ...{ contact_type: 'Committee' } };
    ContactListPage.enterFormData(stepOneContactFormData, true, '@stepOneAccordion');
    PageUtils.clickButton('Save & continue', '@stepOneAccordion');

    const transactionFormData = {
      ...defaultTransactionFormData,
      ...{
        purpose_description: '',
      },
    };
    TransactionDetailPage.enterFormData(transactionFormData, false, '@stepOneAccordion');

    // Enter STEP TWO transaction
    PageUtils.clickLink('STEP TWO');
    cy.get('p-accordiontab').last().as('stepTwoAccordion');
    PageUtils.dropdownSetValue('#entity_type_dropdown', 'Individual', '@stepTwoAccordion');
    PageUtils.clickLink('Create a new contact', '@stepTwoAccordion');
    ContactListPage.enterFormData(defaultContactFormData, true, '@stepTwoAccordion');
    PageUtils.clickButton('Save & continue', '@stepTwoAccordion');
    TransactionDetailPage.enterFormData(transactionFormData, true, '@stepTwoAccordion');

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
    cy.get('@row-1').find('td').eq(TransactionTableColumns.aggregate).should('contain', '$100.55');

    cy.get('tbody tr').eq(1).as('row-2');
    cy.get('@row-2').find('td').eq(TransactionTableColumns.transaction_type).should('contain', 'PAC Earmark Memo');
    cy.get('@row-2')
      .find('td')
      .eq(TransactionTableColumns.name)
      .should('contain', `${stepOneContactFormData['last_name']}, ${stepOneContactFormData['first_name']}`);
    cy.get('@row-2').find('td').eq(TransactionTableColumns.memo_code).should('contain', 'Y');
    cy.get('@row-2').find('td').eq(TransactionTableColumns.aggregate).should('contain', '$100.55');

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
      '@stepOneAccordion'
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
      '@stepTwoAccordion'
    );
  });

  it('Create a Group E,D,A Tier 3 transactions', () => {
    ReportListPage.clickCreateButton();
    F3xCreateReportPage.enterFormData(defaultReportFormData);
    PageUtils.clickButton('Save and continue');

    // Create a Joint Fundraising Transfer
    PageUtils.clickSidebarItem('Add a receipt');
    PageUtils.clickLink('TRANSFERS');
    PageUtils.clickLink('Joint Fundraising Transfer');

    PageUtils.clickLink('Create a new contact');
    const committeeFormContactData = {
      ...defaultContactFormData,
      ...{ contact_type: 'Committee' },
    };
    ContactListPage.enterFormData(committeeFormContactData, true);
    PageUtils.clickButton('Save & continue');

    const tier1TransactionData = {
      ...defaultTransactionFormData,
      ...{ purpose_description: '' },
    };
    TransactionDetailPage.enterFormData(tier1TransactionData);
    PageUtils.dropdownSetValue('[data-test="navigation-control-dropdown"]', 'Partnership Receipt');
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
      ...defaultTransactionFormData,
      ...{ purpose_description: '' },
    };
    TransactionDetailPage.enterFormData(tier2TransactionData);
    PageUtils.dropdownSetValue('[data-test="navigation-control-dropdown"]', 'Individual');
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
      ...defaultTransactionFormData,
      ...{ purpose_description: '' },
    };
    TransactionDetailPage.enterFormData(tier3TransactionData);
    PageUtils.clickButton('Save');
    cy.contains('Confirm').should('exist');
    PageUtils.clickButton('Continue');

    // Assert transaction list table is correct
    cy.get('tbody tr').eq(0).as('row-1');
    cy.get('@row-1')
      .find('td')
      .as('joint_fundraising_transfer_link')
      .eq(TransactionTableColumns.transaction_type)
      .should('contain', 'Joint Fundraising Transfer');
    cy.get('@row-1').find('td').eq(TransactionTableColumns.transaction_type).should('not.contain', 'Unitemized');
    cy.get('@row-1').find('td').eq(TransactionTableColumns.memo_code).should('not.contain', 'Y');
    cy.get('@row-1').find('td').eq(TransactionTableColumns.aggregate).should('contain', '$100.55');

    cy.get('tbody tr').eq(1).as('row-2');
    cy.get('@row-2')
      .find('td')
      .eq(TransactionTableColumns.transaction_type)
      .should('contain', 'Partnership Receipt Joint Fundraising Transfer Memo');
    cy.get('@row-2').find('td').eq(TransactionTableColumns.transaction_type).should('not.contain', 'Unitemized');
    cy.get('@row-2').find('td').eq(TransactionTableColumns.memo_code).should('contain', 'Y');
    cy.get('@row-2').find('td').eq(TransactionTableColumns.aggregate).should('contain', '$100.55');

    cy.get('tbody tr').eq(2).as('row-3');
    cy.get('@row-3')
      .find('td')
      .eq(TransactionTableColumns.transaction_type)
      .should('contain', 'Individual Joint Fundraising Transfer Memo');
    cy.get('@row-3').find('td').eq(TransactionTableColumns.transaction_type).should('not.contain', 'Unitemized');
    cy.get('@row-3').find('td').eq(TransactionTableColumns.memo_code).should('contain', 'Y');
    cy.get('@row-3').find('td').eq(TransactionTableColumns.aggregate).should('contain', '$100.55');

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
