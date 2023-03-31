import { LoginPage } from './pages/loginPage';
import { PageUtils } from './pages/pageUtils';
import { ReportListPage } from './pages/reportListPage';
import { defaultFormData as defaultReportFormData, F3xCreateReportPage } from './pages/f3xCreateReportPage';
import { defaultFormData as defaultContactFormData, ContactListPage } from './pages/contactListPage';
import { defaultFormData as defaultTransactionFormData, TransactionDetailPage } from './pages/transactionDetailPage';

describe('Transactions', () => {
  beforeEach(() => {
    LoginPage.login();
    ContactListPage.deleteAllContacts();
    ReportListPage.deleteAllReports();
    ReportListPage.goToPage();
  });

  xit('Create a Group A transaction', () => {
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
    PageUtils.clickButton('Save & view all transactions');

    cy.get('tr').should('contain', 'Individual Receipt');
    cy.get('tr').should('contain', 'Unitemized');
    cy.get('tr').should('contain', `${defaultContactFormData['last_name']}, ${defaultContactFormData['first_name']}`);
    cy.get('tr').should('contain', PageUtils.dateToString(defaultTransactionFormData['date_received']));
    cy.get('tr').should('contain', '$' + defaultTransactionFormData['amount']);

    PageUtils.clickLink('Individual Receipt');

    cy.get('#entity_type_dropdown > div.p-disabled').should('exist');
    cy.get('#entity_type_dropdown').should('contain', 'Individual');
    ContactListPage.assertFormData(defaultContactFormData, true);
    TransactionDetailPage.assertFormData(defaultTransactionFormData);
  });

  xit('Create a Group B transaction', () => {
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
    PageUtils.clickButton('Save & add another');
    cy.contains('Confirm').should('exist');
    PageUtils.clickButton('Continue');

    // Assert "Save & add another" button provides a new empty form
    cy.get('#organization_name').should('have.value', '');

    PageUtils.clickButton('Cancel');

    cy.get('tr').should('contain', 'Other Disbursement');
    cy.get('tr').should('not.contain', 'Unitemized');
    cy.get('tr').should('contain', formContactData['name']);
    cy.get('tr').should('contain', PageUtils.dateToString(formTransactionData['date_received']));
    cy.get('tr').should('contain', '$' + formTransactionData['amount']);

    PageUtils.clickLink('Other Disbursement');

    cy.get('#entity_type_dropdown > div.p-disabled').should('exist');
    cy.get('#entity_type_dropdown').should('contain', 'Organization');
    ContactListPage.assertFormData(formContactData, true);
    TransactionDetailPage.assertFormData(formTransactionData);
  });

  xit('Create a Group C transaction', () => {
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
    PageUtils.clickButton('Save & view all transactions');
    cy.contains('Confirm').should('exist');
    PageUtils.clickButton('Continue');

    cy.get('tr').should('contain', 'Returned/Bounced Receipt');
    cy.get('tr').should('not.contain', 'Unitemized');
    cy.get('tr').should('contain', `${defaultContactFormData['last_name']}, ${defaultContactFormData['first_name']}`);
    cy.get('tr').should('contain', PageUtils.dateToString(defaultTransactionFormData['date_received']));

    // Assert that the positive amount was converted to a negative amount
    cy.get('tr').should('contain', '-$' + defaultTransactionFormData['amount']);

    PageUtils.clickLink('Returned/Bounced Receipt');

    cy.get('#entity_type_dropdown > div.p-disabled').should('exist');
    cy.get('#entity_type_dropdown').should('contain', 'Individual');
    ContactListPage.assertFormData(defaultContactFormData, true);
    TransactionDetailPage.assertFormData({ ...defaultTransactionFormData, ...{ amount: -100.55 } });
  });

  xit('Create a Group D transaction and memos', () => {
    ReportListPage.clickCreateButton();
    F3xCreateReportPage.enterFormData(defaultReportFormData);
    PageUtils.clickButton('Save and continue');

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
    PageUtils.dropdownSetValue('[inputid="subTransaction"]', 'Partnership Memo');
    cy.contains('Confirm').should('exist');
    PageUtils.clickButton('Continue');

    // Create Partnership Memo transaction
    cy.contains('a', 'Create a new contact').should('exist').wait(500); // Race condition with clicking 'Create a new contact' link being ready
    PageUtils.clickLink('Create a new contact');
    ContactListPage.enterFormData(defaultContactFormData, true);
    PageUtils.clickButton('Save & continue');
    const memoFormTransactionData = {
      ...defaultTransactionFormData,
      ...{ memo_code: true, purpose_description: '' },
    };
    TransactionDetailPage.enterFormData(memoFormTransactionData);
    PageUtils.clickButton('Save & add another Memo');
    cy.contains('Confirm').should('exist');
    PageUtils.clickButton('Continue');

    // Create a second Partnership Memo so we can check the aggregate value
    cy.get('[role="searchbox"]').type(defaultContactFormData['last_name'].slice(0, 1));
    cy.contains(defaultContactFormData['last_name']).should('exist');
    cy.contains(defaultContactFormData['last_name']).click();
    TransactionDetailPage.enterFormData(memoFormTransactionData);
    PageUtils.clickButton('Save & view all transactions');

    // Assert transaction list table is correct
    cy.get('tbody tr').eq(0).as('row-1');
    cy.get('@row-1').find('td').eq(0).contains('Partnership Memo').should('exist');
    cy.get('@row-1').find('td').eq(0).contains('Unitemized').should('not.exist');
    cy.get('@row-1').find('td').eq(3).contains('Y').should('exist');
    cy.get('@row-1').find('td').eq(5).contains('$201.10').should('exist');

    cy.get('tbody tr').eq(1).as('row-2');
    cy.get('@row-2').find('td').eq(0).contains('Partnership Memo').should('exist');
    cy.get('@row-2').find('td').eq(0).contains('Unitemized').should('exist');
    cy.get('@row-2').find('td').eq(3).contains('Y').should('exist');
    cy.get('@row-2').find('td').eq(5).contains('$100.55').should('exist');

    cy.get('tbody tr').eq(2).as('row-3');
    cy.get('@row-3').find('td').eq(0).contains('Partnership Receipt').should('exist');
    cy.get('@row-3').find('td').eq(0).contains('Unitemized').should('exist');
    cy.get('@row-3').find('td').eq(3).contains('Y').should('not.exist');
    cy.get('@row-3').find('td').eq(5).contains('$100.55').should('exist');

    // Check form values of receipt
    PageUtils.clickLink('Partnership Receipt');
    cy.get('#entity_type_dropdown > div.p-disabled').should('exist');
    cy.get('#entity_type_dropdown').should('contain', 'Organization');
    ContactListPage.assertFormData(formContactData, true);
    TransactionDetailPage.assertFormData({
      ...formTransactionData,
      ...{ purpose_description: 'See Partnership Attribution(s) below' },
    });
    PageUtils.clickButton('Save & view all transactions');

    // Check form values of memo
    cy.get('tbody tr').first().contains('a', 'Partnership Memo').click();
    cy.get('#entity_type_dropdown > div.p-disabled').should('exist');
    cy.get('#entity_type_dropdown').should('contain', 'Individual');
    ContactListPage.assertFormData(defaultContactFormData, true);
    TransactionDetailPage.assertFormData({
      ...memoFormTransactionData,
      ...{ purpose_description: 'Partnership Attribution' },
    });
  });

  xit('Create a Group E transaction', () => {
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
    PageUtils.clickButton('Save & view all transactions');
    cy.contains('Confirm').should('exist');
    PageUtils.clickButton('Continue');

    cy.get('tr').should('contain', 'Party Receipt');
    cy.get('tr').should('not.contain', 'Unitemized');
    cy.get('tr').should('contain', formContactData['name']);
    cy.get('tr').should('contain', PageUtils.dateToString(defaultTransactionFormData['date_received']));
    cy.get('tr').should('contain', '$' + defaultTransactionFormData['amount']);

    PageUtils.clickLink('Party Receipt');

    cy.get('#entity_type_dropdown > div.p-disabled').should('exist');
    cy.get('#entity_type_dropdown').should('contain', 'Committee');
    ContactListPage.assertFormData(formContactData, true);
    TransactionDetailPage.assertFormData(defaultTransactionFormData);
  });

  it('Create a Group AG transaction', () => {
    ReportListPage.clickCreateButton();
    F3xCreateReportPage.enterFormData(defaultReportFormData);
    PageUtils.clickButton('Save and continue');

    PageUtils.clickSidebarItem('Add a receipt');
    PageUtils.clickLink('CONTRIBUTIONS FROM INDIVIDUALS/PERSONS');
    PageUtils.clickLink('Earmark Receipt');

    // Enter STEP ONE transaction
    PageUtils.clickLink('STEP ONE');
    PageUtils.clickLink('Create a new contact');
    ContactListPage.enterFormData(defaultContactFormData, true);
    PageUtils.clickButton('Save & continue');
    const transactionFormData = {
      ...defaultTransactionFormData,
      ...{
        purpose_description: '',
      },
    };
    TransactionDetailPage.enterFormData(transactionFormData);

    // Enter STEP TWO transaction
    PageUtils.clickLink('STEP TWO');
    PageUtils.clickLink('Create a new contact');
    const stepTwoContactFormData = { ...defaultContactFormData, ...{ contact_type: 'Committee' } };
    ContactListPage.enterFormData(stepTwoContactFormData, true);
    PageUtils.clickButton('Save & continue');
    TransactionDetailPage.enterFormData(transactionFormData);

    // PageUtils.clickButton('Save & view all transactions');
    // cy.contains('Confirm').should('exist');
    // PageUtils.clickButton('Continue');

    // cy.get('tr').should('contain', 'Party Receipt');
    // cy.get('tr').should('not.contain', 'Unitemized');
    // cy.get('tr').should('contain', formContactData['name']);
    // cy.get('tr').should('contain', PageUtils.dateToString(defaultTransactionFormData['date_received']));
    // cy.get('tr').should('contain', '$' + defaultTransactionFormData['amount']);

    // PageUtils.clickLink('Party Receipt');

    // cy.get('#entity_type_dropdown > div.p-disabled').should('exist');
    // cy.get('#entity_type_dropdown').should('contain', 'Committee');
    // ContactListPage.assertFormData(formContactData, true);
    // TransactionDetailPage.assertFormData(defaultTransactionFormData);
  });
});
