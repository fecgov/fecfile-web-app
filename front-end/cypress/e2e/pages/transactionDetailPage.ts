import { LoanFormData, ScheduleFormData } from '../models/TransactionFormModel';
import { currentYear, PageUtils } from './pageUtils';

export class TransactionDetailPage {
  static enterFormData(formData: ScheduleFormData, readOnlyAmount = false, alias = '') {
    alias = PageUtils.getAlias(alias);

    if (formData['date_received'] != undefined) {
      PageUtils.calendarSetValue('p-calendar[inputid="date"]', formData['date_received'], alias);
    }
    if (formData['memo_code']) {
      cy.get(alias).find('p-checkbox[inputid="memo_code"]').click();
    }
    if (!readOnlyAmount) {
      cy.get(alias).find('#amount').safeType(formData['amount']);
    }
    if (formData['electionType'] != undefined) {
      PageUtils.dropdownSetValue('[inputid="electionType"]', formData['electionType'], alias);
    }
    if (formData['electionYear'] != undefined) {
      cy.get(alias).find('#electionYear').safeType(formData['electionYear']);
    }
    if (formData['election_other_description']) {
      cy.get(alias).find('#election_other_description').safeType(formData['election_other_description']);
    }
    if (formData['purpose_description']) {
      cy.get(alias).find('textarea#purpose_description').safeType(formData['purpose_description']);
    }
    cy.get(alias).find('textarea#text4000').safeType(formData['memo_text']);
    if (formData['category_code']) {
      PageUtils.dropdownSetValue('[inputid="category_code"]', formData['category_code'], alias);
    }
  }

  static enterLoanFormData(formData: LoanFormData, readOnlyAmount = false, alias = '') {
    alias = PageUtils.getAlias(alias);
    cy.get(alias).find('#amount').safeType(formData['amount']);

    if (formData['date_received'] != undefined) {
     PageUtils.calendarSetValue('p-calendar[inputid="date"]', formData['date_received'], alias);
    }

    if (formData['date_incurred'] != undefined) {
      PageUtils.calendarSetValue('p-calendar[inputid="date_incurred"]', formData['date_incurred'], alias, true);
    }

    // Set due date dropdown & date
    if (formData["due_date_setting"] != undefined) {
      PageUtils.dropdownSetValue('[inputid="due_date_setting"]', formData['due_date_setting'], alias);
      if (formData['due_date'] != undefined) {
        PageUtils.calendarSetValue('p-calendar[inputid="due_date"]', formData['due_date'], alias);
      }
    }

    // set interest dropdown and rate
    if (formData["interest_rate_setting"] != undefined) {
      PageUtils.dropdownSetValue('[inputid="interest_rate_setting"]', formData['interest_rate_setting'], alias);
      if (formData['interest_rate'] != undefined) {
        cy.get(alias).find('#interest_rate').safeType(formData['interest_rate']);
      }
    }
    
    if (formData["secured"] != undefined) {
      cy.get(alias).find('input[name="secured"]').first().click({force: true});
    }

    if (formData['memo_text']) {
      cy.get(alias).find('#text4000').type(formData['memo_text']);
    }

    if (formData['purpose_description'] != undefined) {
      cy.get(alias).find('#purpose_description').type(formData['purpose_description']);
    }
  }

  static enterLoanFormDataStepTwo(formData: LoanFormData, readOnlyAmount = false, alias = '') {
    alias = PageUtils.getAlias(alias);
    PageUtils.clickLink("STEP TWO:");
    if (formData["loan_restructured"] != undefined) {
      cy.get(alias).find('input[name="loan_restructured"]').first().click({force: true});
    }

    if (formData["line_of_credit"] != undefined) {
      cy.get(alias).find('input[name="line_of_credit"]').first().click({force: true});
    }

    if (formData["others_liable"] != undefined) {
      cy.get(alias).find('input[name="others_liable"]').first().click({force: true});
    }

    if (formData["collateral"] != undefined) {
      cy.get(alias).find('input[name="collateral"]').first().click({force: true});
    }

    if (formData["future_income"] != undefined) {
      cy.get(alias).find('input[name="future_income"]').first().click({force: true});
    }

    if (formData["last_name"] != undefined) {
      cy.get(alias).find('input#last_name').first().type(formData.last_name);
    }

    if (formData["first_name"] != undefined) {
      cy.get(alias).find('input#first_name').first().type(formData.first_name);
    }

    if (formData["date_signed"] != undefined) {
      PageUtils.calendarSetValue('p-calendar[inputid="date_signed"]', formData["date_signed"])
    }

    if (formData["authorized_first_name"] != undefined) {
      cy.get(alias).find('input[formControlName="authorized_first_name"]').first().type(formData.authorized_first_name);
    }

    // future_income
  }

  static assertFormData(formData: ScheduleFormData, alias = '') {
    alias = PageUtils.getAlias(alias);
    if (formData['date_received']) {
      cy.get(alias).find('#date').should('have.value', PageUtils.dateToString(formData['date_received']));
    }

    cy.get(alias)
      .find('#memo_code')
      .should('have.attr', 'aria-checked', formData['memo_code'] ? 'true' : 'false');
    if (formData['electionType']) {
      cy.get(alias).find('[inputid="electionType"]').should('contain', formData['electionType']);
    }
    if (formData['electionYear']) {
      cy.get(alias).find('#electionYear').should('have.value', formData['electionYear']);
    }
    if (formData['election_other_description']) {
      cy.get(alias).find('#election_other_description').should('have.value', formData['election_other_description']);
    }
    const amount = formData['amount'] < 0 ? '-$' + -1 * formData['amount'] : '$' + formData['amount'];
    cy.get(alias).find('#amount').should('have.value', amount);

    if (formData['category_code']) {
      cy.get(alias).find('[inputid="category_code"]').should('contain', formData['category_code']);
    }
  }
}
