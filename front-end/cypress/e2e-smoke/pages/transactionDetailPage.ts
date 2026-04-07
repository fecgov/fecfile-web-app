import { ContactFormData } from '../models/ContactFormModel';
import {
  ContributionFormData,
  DisbursementFormData,
  LoanFormData,
  ScheduleFormData,
} from '../models/TransactionFormModel';
import { ContactLookup } from './contactLookup';
import { Intercept, PageUtils } from './pageUtils';
import { ReportListPage } from './reportListPage';

export class TransactionDetailPage {
  static readonly SPLIT_BUTTON = 'navigation-control-splitbutton';
  static readonly BUTTON = 'navigation-control-button';

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
      cy.get(alias)
        .find('.contact-lookup-container')
        .last()
        .find('[data-cy="searchBox"] input.p-autocomplete-input')
        .first()
        .clear()
        .type(formData.candidate);
      cy.get('.p-autocomplete-list-container:visible')
        .contains('.p-autocomplete-option', formData.candidate)
        .first()
        .click();
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
      const supportOpposeCode = formData.supportOpposeCode.toString().trim().toUpperCase();
      let supportOpposeOptionId = '';
      if (supportOpposeCode === 'SUPPORT' || supportOpposeCode === 'S') {
        supportOpposeOptionId = '#support';
      } else if (supportOpposeCode === 'OPPOSE' || supportOpposeCode === 'O') {
        supportOpposeOptionId = '#oppose';
      }
      if (!supportOpposeOptionId) {
        throw new Error(`Unsupported support/oppose code: ${formData.supportOpposeCode}`);
      }

      cy.get(alias).find(`[data-cy='support_oppose_code'] ${supportOpposeOptionId}`).first().click();
      ContactLookup.getCandidate(contactData, [], [], '#contact_2_lookup');
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
    this.enterLoanFormData(formData, false, alias, 'input[id^="loan-agreement-amount-"]');
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
    amountField = '#loan-info-amount',
    dateField = 'expenditure_date',
    dateIncurredField = 'loan_incurred_date',
  ) {
    alias = PageUtils.getAlias(alias);
    if (!readOnlyAmount) {
      cy.get(alias).find(amountField).safeType(formData.amount);
    }

    // set interest dropdown and rate
    if (formData.interest_rate_setting) {
      PageUtils.selectDropdownSetValue('[label="INTEREST RATE"]', formData.interest_rate_setting, alias);
      if (formData.interest_rate) {
        cy.get('[data-cy="interestRateInput"]').find('input:visible:first').safeType(formData.interest_rate);
      }
    }

    if (formData.secured) {
      cy.get(alias).find('input[name="secured"]').first().click();
    }

    // Set due date dropdown & date
    if (formData.due_date_setting) {
      PageUtils.selectDropdownSetValue('[label="DATE DUE"]', formData.due_date_setting, alias);
      if (formData.due_date) {
        PageUtils.calendarSetValue(`[data-cy="dueDateInput"] input`, formData.due_date, alias);
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
    alias = '',
    dateSigned1 = 'treasurer_date_signed',
    dateSigned2 = 'authorized_date_signed',
  ) {
    alias = PageUtils.getAlias(alias);

    if (formData.loan_restructured) {
      cy.get(alias).find('input[name="loan_restructured"]').first().click();
    }

    if (formData.line_of_credit) {
      cy.get(alias).find('input#line_of_credit').first().click();
    }

    if (formData.others_liable) {
      cy.get(alias).find('input[name="others_liable"]').first().click();
    }

    if (formData.collateral) {
      cy.get(alias).find('input[name="collateral"]').first().click();
    }

    if (formData.future_income) {
      cy.get(alias).find('input[name="future_income"]').first().click();
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
      cy.get(alias).find('app-select[inputid="category_code"]').should('contain', formData.category_code);
    }
  }

  static clickSave(buttonType = this.SPLIT_BUTTON) {
    PageUtils.clickFormActionButton('Save', `app-navigation-control-bar,[data-cy="${buttonType}"]:visible`);
  }

  static clickInlineSave() {
    PageUtils.clickFormActionButton('Save', `[data-cy="${this.BUTTON}"]:visible`);
  }

  static clickSaveBothTransactions() {
    PageUtils.clickFormActionButton('Save both transactions', `[data-cy="${this.BUTTON}"]:visible`);
  }

  static clickCancel() {
    PageUtils.clickButton('Cancel', '[data-cy="navigation-control-button"]:visible');
  }

  static addGuarantor(name: string, amount: number | string, reportId: string, isUpdate = false) {
    const intercept: Intercept = isUpdate
      ? { method: 'PUT', url: `http://localhost:8080/api/v1/transactions/**/`, alias: 'UpdateTransaction' }
      : { method: 'POST', url: `http://localhost:8080/api/v1/transactions/`, alias: 'AddTransaction' };
    const fx = () => {
      PageUtils.interceptAndWait([intercept], () => {
        PageUtils.clickButton('Save & add loan guarantor');
        PageUtils.closeToast();
      });

      cy.contains('Guarantors to loan source').should('exist');
      ContactLookup.getContact(name);
      cy.get('#amount').safeType(amount);
      cy.intercept({
        method: 'Post',
      }).as('saveGuarantor');
      PageUtils.clickButton('Save & add loan guarantor');
      cy.wait('@saveGuarantor');
      PageUtils.closeToast();
      PageUtils.urlCheck('create-sub-transaction' + '/C2_LOAN_GUARANTOR');
      this.clickCancel();
    };

    ReportListPage.interceptTransactions(reportId, fx);
  }

  private static enterMemo(formData: ScheduleFormData, alias: string) {
    if (formData.memo_code) {
      cy.get(alias)
        .find('p-checkbox[inputid="memo_code"]')
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
      PageUtils.selectDropdownSetValue('app-select[inputid="category_code"]', formData.category_code, alias);
    }
  }

  private static enterElection(formData: ScheduleFormData, alias: string) {
    if (formData.electionType) {
      PageUtils.selectDropdownSetValue('[inputid="electionType"]', formData.electionType, alias);
    }
    if (formData.electionYear) {
      cy.get(alias).find('#electionYear').safeType(formData.electionYear);
    }
    if (formData.election_other_description) {
      cy.get(alias).find('#election_other_description').safeType(formData.election_other_description);
    }
  }

  private static enterPurpose(formData: ScheduleFormData, alias: string) {
    const purposeDescription = formData.purpose_description;
    if (purposeDescription) {
      cy.get(alias).then(($root) => {
        const purposeInput = $root.find('textarea#purpose_description:visible:not([readonly]):not([disabled])').first();
        if (purposeInput.length > 0) {
          cy.wrap(purposeInput).safeType(purposeDescription);
        }
      });
    }
  }

  private static enterCommon(formData: ScheduleFormData, alias: string, includeMemo = true) {
    if (includeMemo) this.enterMemo(formData, alias);
    this.enterPurpose(formData, alias);
    this.enterCategoryCode(formData, alias);
  }
}
