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

  private static enterMemo(formData: ScheduleFormData, alias: string) {
    if (formData.memo_code) {
      cy.get(alias).find('p-checkbox[inputid="memo_code"]').click();
    }
    if (formData.memo_text !== '') {
      cy.get(alias).find('#text4000').first().type(formData.memo_text);
    }
  }

  private static enterCategoryCode(formData: ScheduleFormData, alias: string) {
    if (formData.category_code != '') {
      PageUtils.dropdownSetValue('[inputid="category_code"]', formData.category_code, alias);
    }
  }

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
      const element = cy.get(alias).find('textarea#purpose_description').first();
    }
  }

  private static enterCommon(formData: ScheduleFormData, alias: string) {
    this.enterMemo(formData, alias);
    this.enterPurpose(formData, alias);
    this.enterCategoryCode(formData, alias);
  }

  static enterScheduleFormDataForContribution(formData: ContributionFormData, readOnlyAmount = false, alias = '') {
    alias = PageUtils.getAlias(alias);

    if (formData.date_received) {
      this.enterDate('p-calendar[inputid="date"]', formData.date_received, alias);
    }

    if (formData.candidate) {
      cy.get('.contact-lookup-container').last().get('[role="searchbox"]').last().type(formData.candidate);
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
  ) {
    alias = PageUtils.getAlias(alias);

    if (formData.date_received) {
      this.enterDate('p-calendar[inputid="date"]', formData.date_received, alias);
    }
    if (formData.date2) {
      this.enterDate('p-calendar[inputid="date2"]', formData.date2, alias);
    }

    if (formData.supportOpposeCode) {
      cy.get("p-radiobutton[FormControlName='support_oppose_code']").contains(formData.supportOpposeCode).click();
      cy.get('#entity_type_dropdown').last().type(contactData.contact_type);
      cy.get('[role="searchbox"]').last().type(contactData.last_name.slice(0, 1));
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
        .find("p-calendar[inputid='date_signed']")
        .type('04/27/2024');
    }
  }

  static enterNewLoanAgreementFormData(formData: LoanFormData, alias = '') {
    this.enterLoanFormData(formData);
    this.enterLoanFormDataStepTwo(formData);
  }

  static enterScheduleFormData(formData: ScheduleFormData, readOnlyAmount = false, alias = '') {
    alias = PageUtils.getAlias(alias);

    if (formData.date_received) {
      this.enterDate('p-calendar[inputid="date"]', formData.date_received, alias);
    }

    this.enterCommon(formData, alias);
    if (!readOnlyAmount) {
      cy.get(alias).find('#amount').safeType(formData['amount']);
    }
    this.enterElection(formData, alias);
  }

  /*
  
  */

  static enterLoanFormData(formData: LoanFormData, readOnlyAmount = false, alias = '') {
    alias = PageUtils.getAlias(alias);
    cy.get(alias).find('#amount').safeType(formData.amount);

    if (formData.date_incurred) {
      this.enterDate('p-calendar[inputid="date_incurred"]', formData.date_incurred, alias);
    }

    if (formData.date_received) {
      this.enterDate('p-calendar[inputid="date"]', formData.date_received, alias);
    }

    // Set due date dropdown & date
    if (formData.due_date_setting) {
      PageUtils.dropdownSetValue('[inputid="due_date_setting"]', formData.due_date_setting, alias);
      if (formData.due_date) {
        PageUtils.calendarSetValue('p-calendar[inputid="due_date"]', formData.due_date, alias);
      }
    }

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

    this.enterCommon(formData, alias);
  }

  static enterLoanFormDataStepTwo(formData: LoanFormData, readOnlyAmount = false, alias = '') {
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
      PageUtils.calendarSetValue('p-calendar[inputid="date_signed"]', formData.date_signed);
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
        .find("p-calendar[inputid='date_signed']")
        .type('04/27/2024');
    }
  }

  static assertFormData(formData: ScheduleFormData, alias = '') {
    alias = PageUtils.getAlias(alias);
    if (formData.date_received) {
      cy.get(alias).find('#date').should('have.value', PageUtils.dateToString(formData.date_received));
    }

    cy.get(alias)
      .find('#memo_code')
      .should('have.attr', 'aria-checked', formData.memo_code ? 'true' : 'false');
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
}
