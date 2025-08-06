import { Initialize, setCommitteeToPTY } from '../pages/loginPage';
import { currentYear, PageUtils } from '../pages/pageUtils';
import { TransactionDetailPage } from '../pages/transactionDetailPage';

import {
  defaultScheduleFormData as defaultTransactionFormData,
  DisbursementFormData,
  formTransactionDataForSchedule,
} from '../models/TransactionFormModel';
import { F3XSetup } from './f3x-setup';
import { StartTransaction } from './utils/start-transaction/start-transaction';
import { faker } from '@faker-js/faker';
import { F24Setup } from '../F24/f24-setup';
import { ContactListPage } from '../pages/contactListPage';
import { ReportListPage } from '../pages/reportListPage';
import { ContactLookup } from '../pages/contactLookup';

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
    cy.wrap(F3XSetup({ individual: true })).then((result: any) => {
      setCommitteeToPTY();
      cy.visit(`/reports/transactions/report/${result.report}/list`);
      StartTransaction.Disbursements().Federal().HundredPercentFederalElectionActivityPayment();
      ContactLookup.getContact(result.individual.last_name, '', 'Individual');

      TransactionDetailPage.enterScheduleFormData(defaultTransactionFormData);

      PageUtils.clickButton('Save');
      cy.contains('Transactions in this report').should('exist');
      PageUtils.clickLink('100% Federal Election Activity Payment');
      cy.contains('Address').should('exist');
      cy.get('#last_name').should('have.value', result.individual.last_name);
      cy.get('#first_name').should('have.value', result.individual.first_name);
    });
  });

  it('should test Independent Expenditure - Void Schedule E disbursement', () => {
    cy.wrap(F3XSetup({ individual: true, candidate: true, organization: true })).then((result: any) => {
      cy.visit(`/reports/transactions/report/${result.report}/list`);
      StartTransaction.Disbursements().Contributions().IndependentExpenditureVoid();
      ContactLookup.getContact(result.organization.name);
      TransactionDetailPage.enterSheduleFormDataForVoidExpenditure(
        independentExpVoidData,
        result.candidate,
        false,
        '',
        'date_signed',
      );

      PageUtils.clickButton('Save');
      PageUtils.clickLink('Independent Expenditure - Void');
      cy.contains('Address').should('exist');
      cy.get('#organization_name').should('have.value', result.organization.name);
    });
  });

  it('should be able to link an Independent Expenditure to a Form 24', () => {
    cy.wrap(F3XSetup({ individual: true, candidate: true })).then((result: any) => {
      cy.wrap(F24Setup()).then(() => {
        cy.visit(`/reports/transactions/report/${result.report}/list`);
        StartTransaction.Disbursements().Contributions().IndependentExpenditure();

        ContactLookup.getContact(result.individual.last_name, '', 'Individual');

        TransactionDetailPage.enterSheduleFormDataForVoidExpenditure(
          independentExpVoidData,
          result.candidate,
          false,
          '',
          'date_signed',
        );
        PageUtils.clickButton('Save');

        // Check that fields saved correctly
        PageUtils.clickLink('Independent Expenditure');
        cy.contains('Address').should('exist');
        cy.get('#first_name').should('have.value', result.individual.first_name);
        cy.get('#last_name').should('have.value', result.individual.last_name);

        // Check that the date fields have the right errors
        cy.get('#dissemination_date').clear();
        cy.get('#disbursement_date').clear();
        PageUtils.clickButton('Save'); // Trigger errors to show
        cy.get('app-amount-input')
          .should('contain', 'At least ONE date field must be entered.')
          .should('not.contain', 'This is a required field.');

        // Add IE to a F24 Report
        PageUtils.clickSidebarItem('Manage your transactions');

        PageUtils.clickKababItem('Independent Expenditure', 'Add to Form24 Report');
        PageUtils.dropdownSetValue('[data-cy="select-form-24"]', '24-HOUR: Report of Independent Expenditure');
        PageUtils.clickButton('Confirm');

        ReportListPage.editReport('FORM 24');
        PageUtils.clickLink('Independent Expenditure');
        cy.contains('Address').should('exist');
        cy.get('#first_name').should('have.value', result.individual.first_name);
        cy.get('#last_name').should('have.value', result.individual.last_name);
      });
    });
  });

  it('Create an Other Disbursement transaction', () => {
    cy.wrap(F3XSetup({ organization: true })).then((result: any) => {
      cy.visit(`/reports/transactions/report/${result.report}/list`);
      StartTransaction.Disbursements().Other().Other();
      ContactLookup.getContact(result.organization.name);

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

      cy.get('tr').should('contain', 'Other Disbursement');
      cy.get('tr').should('not.contain', 'Unitemized');
      cy.get('tr').should('contain', result.organization.name);
      cy.get('tr').should('contain', PageUtils.dateToString(formTransactionData.date_received));
      cy.get('tr').should('contain', '$' + formTransactionDataForSchedule.amount);

      // Check values of edit form
      PageUtils.clickLink('Other Disbursement');
      cy.get('#entity_type_dropdown.readonly').should('exist');
      cy.get('#entity_type_dropdown').should('contain', 'Organization');
      ContactListPage.assertFormData(result.organization, true);
      TransactionDetailPage.assertFormData(formTransactionDataForSchedule);
    });
  });

  it('Create a Credit Card Payment for 100% Federal Election Activity transaction', () => {
    cy.wrap(F3XSetup({ organization: true })).then((result: any) => {
      setCommitteeToPTY();
      cy.visit(`/reports/transactions/report/${result.report}/list`);
      StartTransaction.Disbursements().Federal().CreditCardPayment();
      ContactLookup.getContact(result.organization.name);

      const transactionFormData = {
        ...formTransactionDataForSchedule,
        ...{
          electionType: 'General',
          electionYear: 2024,
          election_other_description: faker.lorem.sentence({ min: 1, max: 2 }),
          purpose_description: '',
          category_code: '',
          date_received: new Date(currentYear, 4 - 1, 27),
          memoCode: false,
        },
      };
      TransactionDetailPage.enterScheduleFormData(transactionFormData, false, '', false);
      cy.get('[data-cy="navigation-control-button"]').contains('button', 'Save').click();

      cy.get('tr').should('contain', 'Credit Card Payment for 100% Federal Election Activity');
      cy.get('tr').should('contain', result.organization.name);
      cy.get('tr').should('contain', PageUtils.dateToString(transactionFormData.date_received));
      cy.get('tr').should('contain', '$' + transactionFormData.amount);

      // Check values of edit form
      PageUtils.clickLink('Credit Card Payment for 100% Federal Election Activity');
      cy.get('#entity_type_dropdown.readonly').should('exist');
      cy.get('#entity_type_dropdown').should('contain', 'Organization');
      ContactListPage.assertFormData(result.organization, true);
      TransactionDetailPage.assertFormData(transactionFormData);
    });
  });
});
