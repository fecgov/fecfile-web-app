import { Initialize, setCommitteeType } from '../pages/loginPage';
import { currentYear, PageUtils } from '../pages/pageUtils';
import { TransactionDetailPage } from '../pages/transactionDetailPage';
import {
  candidateFormData,
  defaultFormData as individualContactFormData,
  organizationFormData,
} from '../models/ContactFormModel';
import {
  defaultScheduleFormData as defaultTransactionFormData,
  DisbursementFormData,
  formTransactionDataForSchedule,
} from '../models/TransactionFormModel';
import { F3XSetup } from './f3x-setup';
import { StartTransaction } from './start-transaction/start-transaction';
import { faker } from '@faker-js/faker';
import { ReportListPage } from '../pages/reportListPage';
import { F24Setup } from '../F24/f24-setup';
import { ContactListPage } from '../pages/contactListPage';

const independentExpVoidData: DisbursementFormData = {
  ...defaultTransactionFormData,
  ...{
    date2: new Date(currentYear, 4 - 1, 27),
    supportOpposeCode: 'SUPPORT',
    signatoryDateSigned: new Date(currentYear, 4 - 1, 27),
    signatoryFirstName: faker.person.firstName(),
    signatoryLastName: faker.person.lastName(),
  },
};

describe('Disbursements', () => {
  beforeEach(() => {
    Initialize();
  });

  it('should test F3xFederalElectionActivityExpendituresPage disbursement', () => {
    F3XSetup({ individual: true });
    setCommitteeType('X');
    StartTransaction.Disbursements().Federal().HundredPercentFederalElectionActivityPayment();

    PageUtils.dropdownSetValue('#entity_type_dropdown', individualContactFormData.contact_type, '');
    cy.contains('LOOKUP').should('exist');
    cy.get('[id="searchBox"]').type(individualContactFormData.last_name.slice(0, 1));
    cy.contains(individualContactFormData.last_name).should('exist');
    cy.contains(individualContactFormData.last_name).click();

    TransactionDetailPage.enterScheduleFormData(defaultTransactionFormData);

    PageUtils.clickButton('Save');
    cy.contains('Transactions in this report').should('exist');
    PageUtils.clickLink('100% Federal Election Activity Payment');
    cy.contains('Address').should('exist');
    cy.get('#last_name').should('have.value', individualContactFormData.last_name);
    cy.get('#first_name').should('have.value', individualContactFormData.first_name);
  });

  it('should test Independent Expenditure - Void Schedule E disbursement', () => {
    F3XSetup({ organization: true, candidate: true });
    StartTransaction.Disbursements().Independent().IndependentExpenditureVoid();

    PageUtils.dropdownSetValue('#entity_type_dropdown', organizationFormData.contact_type, '');
    cy.contains('LOOKUP').should('exist');
    cy.get('[id="searchBox"]').type(organizationFormData.name.slice(0, 1));
    cy.contains(organizationFormData.name).should('exist');
    cy.contains(organizationFormData.name).click();

    TransactionDetailPage.enterSheduleFormDataForVoidExpenditure(independentExpVoidData, candidateFormData);

    PageUtils.clickButton('Save');
    PageUtils.clickLink('Independent Expenditure - Void');
    cy.contains('Address').should('exist');
    cy.get('#organization_name').should('have.value', organizationFormData.name);
  });

  it('should be able to link an Independent Expenditure to a Form 24', () => {
    F24Setup({ individual: true, candidate: true });
    F3XSetup();
    StartTransaction.Disbursements().Independent().IndependentExpenditure();

    PageUtils.dropdownSetValue('#entity_type_dropdown', individualContactFormData.contact_type, '');
    cy.contains('LOOKUP').should('exist');
    cy.get('[id="searchBox"]').type(individualContactFormData.last_name.slice(0, 1));
    cy.contains(individualContactFormData.last_name).should('exist');
    cy.contains(individualContactFormData.last_name).click();

    TransactionDetailPage.enterSheduleFormDataForVoidExpenditure(independentExpVoidData, candidateFormData);

    PageUtils.clickButton('Save');
    PageUtils.clickLink('Independent Expenditure');
    cy.get('#first_name').should('have.value', individualContactFormData.first_name);
    cy.get('#last_name').should('have.value', individualContactFormData.last_name);
    PageUtils.clickSidebarItem('Manage your transactions');

    PageUtils.getKabob('Independent Expenditure').click();
    PageUtils.clickButton('Add to Form24 Report', '', true);
    //PageUtils.dropdownSetValue('', '#1')
    PageUtils.clickButton('Select a F24 Report');
    cy.get('.dropdown > ul').contains('#1').click();
    PageUtils.clickButton('Confirm');

    ReportListPage.editReport('FORM 24');
    PageUtils.clickLink('Independent Expenditure');
    cy.get('#first_name').should('have.value', individualContactFormData.first_name);
    cy.get('#last_name').should('have.value', individualContactFormData.last_name);
  });

  it('Create an Other Disbursement transaction', () => {
    F3XSetup();
    StartTransaction.Disbursements().Other().Other();

    PageUtils.clickLink('Create a new contact');
    const formContactData = {
      ...individualContactFormData,
      ...{ contact_type: 'Organization' },
    };
    ContactListPage.enterFormData(formContactData, true);
    PageUtils.clickButton('Save & continue');

    const formTransactionData = {
      ...defaultTransactionFormData,
      ...{
        amount: 200.01,
        category_code: '005 Polling Expenses',
        electionYear: undefined,
        electionType: undefined,
        date_received: new Date(currentYear, 4 - 1, 27),
      },
    };
    TransactionDetailPage.enterScheduleFormData(formTransactionData);
    PageUtils.clickButton('Save');
    cy.contains('Confirm').should('exist');
    PageUtils.clickButton('Continue');

    cy.get('tr').should('contain', 'Other Disbursement');
    cy.get('tr').should('not.contain', 'Unitemized');
    cy.get('tr').should('contain', formContactData.name);
    cy.get('tr').should('contain', PageUtils.dateToString(formTransactionData.date_received));
    cy.get('tr').should('contain', '$' + formTransactionDataForSchedule.amount);

    // Check values of edit form
    PageUtils.clickLink('Other Disbursement');
    cy.get('#entity_type_dropdown > div.readonly').should('exist');
    cy.get('#entity_type_dropdown').should('contain', 'Organization');
    ContactListPage.assertFormData(formContactData, true);
    TransactionDetailPage.assertFormData(formTransactionDataForSchedule);
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
});
