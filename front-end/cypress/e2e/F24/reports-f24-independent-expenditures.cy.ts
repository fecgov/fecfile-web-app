import { Initialize } from '../pages/loginPage';
import { currentYear, PageUtils } from '../pages/pageUtils';
import { TransactionDetailPage } from '../pages/transactionDetailPage';
import {
  defaultScheduleFormData as defaultTransactionFormData,
  DisbursementFormData,
} from '../models/TransactionFormModel';
import { f3ReportId$, F3XSetup } from '../F3X/f3x-setup';
import { StartTransaction } from '../F3X/utils/start-transaction/start-transaction';
import { faker } from '@faker-js/faker';
import { F24Setup } from './f24-setup';
import { ReportListPage } from '../pages/reportListPage';
import { Candidate_House_A, Candidate_House_A$, Individual_A_A, Individual_A_A$ } from '../requests/library/contacts';
import { F24_24, F3X_Q1 } from '../requests/library/reports';
import { makeRequestToAPI } from '../requests/methods';
import { buildIndependentExpenditure } from '../requests/library/transactions';
import { combineLatest, filter, first } from 'rxjs';

const independentExpenditureData: DisbursementFormData = {
  ...defaultTransactionFormData,
  ...{
    date2: new Date(currentYear, 4 - 1, 27),
    supportOpposeCode: 'SUPPORT',
    signatoryDateSigned: new Date(currentYear, 4 - 1, 27),
    signatoryFirstName: faker.person.firstName(),
    signatoryLastName: faker.person.lastName(),
  },
};

describe('Form 24 Independent Expenditures', () => {
  beforeEach(() => {
    Initialize();
  });

  it('Independent Expenditures created on a Form 24 should be linked to a Form 3X', () => {
    F24Setup();
    F3XSetup({ individual: true, candidate: true });

    ReportListPage.editReport('FORM 24');
    StartTransaction.IndependentExpenditures().IndependentExpenditure();

    PageUtils.dropdownSetValue('#entity_type_dropdown', 'Individual', '');
    cy.contains('LOOKUP').should('exist');
    cy.get('[id="searchBox"]').type(Individual_A_A.last_name.slice(0, 3));
    cy.contains(Individual_A_A.last_name).should('exist');
    cy.contains(Individual_A_A.last_name).click({ force: true });

    TransactionDetailPage.enterSheduleFormDataForVoidExpenditure(
      independentExpenditureData,
      { contact_type: 'Candidate', last_name: Candidate_House_A.last_name },
      false,
      '',
      'date_signed',
    );

    PageUtils.clickButton('Save');
    PageUtils.clickLink('Independent Expenditure');
    cy.contains('Address').should('exist');
    cy.get('#first_name').should('have.value', Individual_A_A.first_name);
    cy.get('#last_name').should('have.value', Individual_A_A.last_name);

    ReportListPage.editReport('JULY 15 QUARTERLY REPORT (Q2)');
    PageUtils.clickSidebarItem('Manage your transactions');
    PageUtils.clickLink('Independent Expenditure');
    cy.contains('Address').should('exist');
    cy.get('#first_name').should('have.value', Individual_A_A.first_name);
    cy.get('#last_name').should('have.value', Individual_A_A.last_name);
  });

  it('Linked Independent Expenditure should show on F24 by default', () => {
    makeRequestToAPI(
      'POST',
      'http://localhost:8080/api/v1/reports/form-3x/?fields_to_validate=filing_frequency',
      F3X_Q1,
    );
    F24Setup();
    F3XSetup({ individual: true, candidate: true });

    combineLatest([
      Individual_A_A$.pipe(filter((value) => value !== undefined)),
      Candidate_House_A$.pipe(filter((value) => value !== undefined)),
      f3ReportId$.pipe(filter((value) => value !== '')),
    ])
      .pipe(first())
      .subscribe(([individualA, candidateHouseA, f3ReportId]) => {
        const transaction_a = buildIndependentExpenditure(
          200.01,
          ['2025-01-12', '2025-01-12'],
          [individualA, candidateHouseA],
          true,
          f3ReportId,
          { election_code: 'P2020', support_oppose_code: 'S', date_signed: '2025-07-09' },
        );

        makeRequestToAPI('POST', 'http://localhost:8080/api/v1/transactions/', transaction_a, () => {
          ReportListPage.editReport('JULY 15 QUARTERLY REPORT (Q2)');
          PageUtils.clickKababItem('Independent Expenditure', 'Add to Form24 Report');
          PageUtils.dropdownSetValue('[data-cy="select-form-24"]', F24_24.name);
          PageUtils.clickButton('Confirm');

          ReportListPage.editReport('FORM 24');
          PageUtils.clickLink('Independent Expenditure');
          cy.contains('Address').should('exist');
          cy.get('#first_name').should('have.value', Individual_A_A.first_name);
          cy.get('#last_name').should('have.value', Individual_A_A.last_name);
          cy.get('[formcontrolname="linkedF3x"]').should('have.value', 'JULY 15 (Q2): 04/01/2025 - 06/30/2025');

          TransactionDetailPage.enterDate('[data-cy="disbursement_date"]', new Date('01/01/2025'));
          cy.get('[formcontrolname="linkedF3x"]').should('have.value', 'APRIL 15 (Q1): 01/01/2025 - 03/31/2025');
        });
      });
  });
});
