import { ContactFormData } from '../models/ContactFormModel';
import {
  ContributionFormData,
  DisbursementFormData,
  LoanFormData,
  ScheduleFormData,
} from '../models/TransactionFormModel';
import { PageUtils } from './pageUtils';

export class TransactionDetailPage {
  static enterDate(dateFieldName: string, dateFieldValue: Date, alias = '') {
    alias = PageUtils.getAlias(alias);
    PageUtils.calendarSetValue(dateFieldName, dateFieldValue, alias);
  }

  static enterScheduleFormDataForContribution(
    formData: ContributionFormData,
    readOnlyAmount = false,
    alias = '',
    dateField = 'enterLoanFormData',
  ) {
    alias = PageUtils.getAlias(alias);

    if (formData.date_received) {
      this.enterDate(`[data-cy="${dateField}"]`, formData.date_received, alias);
    }

    if (formData.candidate) {
      cy.get('.contact-lookup-container').last().get('[id="searchBox"]').last().type(formData.candidate);
      cy.contains(formData.candidate).should('exist');
      cy.contains(formData.candidate).click();
    }

    this.enterCommon(formData, alias);
    if (!readOnlyAmount) {
      cy.get(alias).find('#amount').safeType(formData['amount']);
    }
    this.enterElection(formData, alias);
  }

  static enterSheduleFormDataForVoidExpenditure(
    formData: DisbursementFormData,
    contactData: ContactFormData,
    readOnlyAmount = false,
    alias = '',
    dateSigned = 'treasurer_date_signed',
  ) {
    alias = PageUtils.getAlias(alias);

    if (formData.date_received) {
      this.enterDate('[data-cy="disbursement_date"]', formData.date_received, alias);
    }
    if (formData.date2) {
      this.enterDate('[data-cy="dissemination_date"]', formData.date2, alias);
    }

    if (formData.supportOpposeCode) {
      cy.get("[data-cy='support_oppose_code']").contains(formData.supportOpposeCode).click();
      cy.get('#entity_type_dropdown').last().type(contactData.contact_type);
      cy.get('[id="searchBox"]').last().type(contactData.last_name.slice(0, 3));
      cy.contains(contactData.last_name).should('exist');
      cy.contains(contactData.last_name).click();
    }

    this.enterCommon(formData, alias);
    if (!readOnlyAmount) {
      cy.get(alias).find('#amount').safeType(formData['amount']);
    }
    this.enterElection(formData, alias);

    if (formData.signatoryLastName) {
      cy.get(alias)
        .find('.signatory_1_input')
        .children()
        .find('app-name-input')
        .children()
        .find('input#last_name')
        .type(formData.signatoryLastName);
      cy.get(alias)
        .find('.signatory_1_input')
        .children()
        .find('app-name-input')
        .children()
        .find('input#first_name')
        .type(formData.signatoryFirstName);
      cy.get(alias)
        .find('.signatory_1_input')
        .children()
        .find('div.grid')
        .children()
        .find(`[data-cy='${dateSigned}']`)
        .type('04/27/2024');
    }
  }

  static enterNewLoanAgreementFormData(formData: LoanFormData, alias = '') {
    this.enterLoanFormData(formData);
    this.enterLoanFormDataStepTwo(formData);
  }

  static enterScheduleFormData(
    formData: ScheduleFormData,
    readOnlyAmount = false,
    alias = '',
    includeMemo = true,
    dateField = 'expenditure_date',
  ) {
    alias = PageUtils.getAlias(alias);

    if (formData.date_received) {
      this.enterDate(`[data-cy="${dateField}"]`, formData.date_received, alias);
    }

    this.enterCommon(formData, alias, includeMemo);
    if (!readOnlyAmount) {
      cy.get(alias).find('#amount').safeType(formData['amount']);
    }
    this.enterElection(formData, alias);
  }

  static enterLoanFormData(
    formData: LoanFormData,
    readOnlyAmount = false,
    alias = '',
    dateField = 'expenditure_date',
    dueDateField = 'loan_due_date',
    dateIncurredField = 'loan_incurred_date',
  ) {
    alias = PageUtils.getAlias(alias);
    cy.get(alias).find('#amount').safeType(formData.amount);

    // set interest dropdown and rate
    if (formData.interest_rate_setting) {
      PageUtils.dropdownSetValue('[inputid="interest_rate_setting"]', formData.interest_rate_setting, alias);
      if (formData.interest_rate) {
        cy.get(alias).find('#interest_rate').safeType(formData.interest_rate);
      }
    }

    if (formData.secured) {
      cy.get(alias).find('input[name="secured"]').first().click({ force: true });
    }

    // Set due date dropdown & date
    if (formData.due_date_setting) {
      PageUtils.dropdownSetValue('[inputid="due_date_setting"]', formData.due_date_setting, alias);
      if (formData.due_date) {
        PageUtils.calendarSetValue(`[data-cy="${dueDateField}"]`, formData.due_date, alias);
      }
    }

    if (formData.date_incurred) {
      this.enterDate(`[data-cy="${dateIncurredField}"]`, formData.date_incurred, alias);
    }

    if (formData.date_received) {
      this.enterDate(`[data-cy="${dateField}"]`, formData.date_received, alias);
    }

    this.enterCommon(formData, alias);
  }

  static enterLoanFormDataStepTwo(
    formData: LoanFormData,
    readOnlyAmount = false,
    alias = '',
    dateSigned1 = 'treasurer_date_signed',
    dateSigned2 = 'authorized_date_signed',
  ) {
    alias = PageUtils.getAlias(alias);

    if (formData.loan_restructured) {
      cy.get(alias).find('input[name="loan_restructured"]').first().click({ force: true });
    }

    if (formData.line_of_credit) {
      cy.get(alias).find('input[name="line_of_credit"]').first().click({ force: true });
    }

    if (formData.others_liable) {
      cy.get(alias).find('input[name="others_liable"]').first().click({ force: true });
    }

    if (formData.collateral) {
      cy.get(alias).find('input[name="collateral"]').first().click({ force: true });
    }

    if (formData.future_income) {
      cy.get(alias).find('input[name="future_income"]').first().click({ force: true });
    }

    if (formData.last_name) {
      cy.get(alias).find('input#last_name').first().type(formData.last_name);
    }

    if (formData.first_name) {
      cy.get(alias).find('input#first_name').first().type(formData.first_name);
    }

    if (formData.date_signed) {
      PageUtils.calendarSetValue(`[data-cy="${dateSigned1}"]`, formData.date_signed);
    }

    if (formData.authorized_first_name) {
      cy.get(alias)
        .find('.signatory_2_input')
        .children()
        .find('app-name-input')
        .children()
        .find('input#last_name')
        .type(formData.authorized_last_name);
      cy.get(alias)
        .find('.signatory_2_input')
        .children()
        .find('app-name-input')
        .children()
        .find('input#first_name')
        .type(formData.authorized_first_name);
      cy.get(alias)
        .find('.signatory_2_input')
        .children()
        .find('div.grid')
        .children()
        .find('input#title')
        .type(formData.authorized_title);
      cy.get(alias)
        .find('.signatory_2_input')
        .children()
        .find('div.grid')
        .children()
        .find(`[data-cy='${dateSigned2}']`)
        .type('04/27/2024');
    }
  }

  static assertFormData(formData: ScheduleFormData, alias = '', id = '#expenditure_date') {
    alias = PageUtils.getAlias(alias);
    if (formData.date_received) {
      cy.get(alias).find(id).should('have.value', PageUtils.dateToString(formData.date_received));
    }

    cy.get(alias)
      .find('p-checkbox[inputid="memo_code"]')
      .find('.p-checkbox')
      .should(formData.memo_code ? 'have.class' : 'not.have.class', 'p-checkbox-checked');
    if (formData.electionType) {
      cy.get(alias).find('[inputid="electionType"]').should('contain', formData.electionType);
    }
    if (formData.electionYear) {
      cy.get(alias).find('#electionYear').should('have.value', formData.electionYear);
    }
    if (formData.election_other_description) {
      cy.get(alias).find('#election_other_description').should('have.value', formData.election_other_description);
    }
    const amount = formData.amount < 0 ? '-$' + -1 * formData.amount : '$' + formData.amount;
    cy.get(alias).find('#amount').should('have.value', amount);

    if (formData.category_code != '') {
      cy.get(alias).find('[inputid="category_code"]').should('contain', formData.category_code);
    }
  }

  private static enterMemo(formData: ScheduleFormData, alias: string) {
    if (formData.memo_code) {
      cy.get(alias)
        .find('p-checkbox[inputid="memo_code"]')
        .find('.p-checkbox')
        .then(($checkbox) => {
          if (!$checkbox.hasClass('p-checkbox-checked')) {
            cy.wrap($checkbox).click();
          }
        });
    }
    if (formData.memo_text !== '') {
      cy.get(alias).find('#text4000').first().type(formData.memo_text);
    }
  }

  private static enterCategoryCode(formData: ScheduleFormData, alias: string) {
    if (formData.category_code) {
      PageUtils.dropdownSetValue('[inputid="category_code"]', formData.category_code, alias);
    }
  }

  /*
  
  */

  private static enterElection(formData: ScheduleFormData, alias: string) {
    if (formData.electionType) {
      PageUtils.dropdownSetValue('[inputid="electionType"]', formData.electionType, alias);
    }
    if (formData.electionYear) {
      cy.get(alias).find('#electionYear').safeType(formData.electionYear);
    }
    if (formData.election_other_description) {
      cy.get(alias).find('#election_other_description').safeType(formData.election_other_description);
    }
  }

  private static enterPurpose(formData: ScheduleFormData, alias: string) {
    if (formData.purpose_description) {
      cy.get(alias).find('textarea#purpose_description').first().safeType(formData.purpose_description);
    }
  }

  private static enterCommon(formData: ScheduleFormData, alias: string, includeMemo = true) {
    if (includeMemo) this.enterMemo(formData, alias);
    this.enterPurpose(formData, alias);
    this.enterCategoryCode(formData, alias);
  }
}
