import { ContactFormData } from '../models/ContactFormModel';
import {
  ContributionFormData,
  DisbursementFormData,
  LoanFormData,
  ScheduleFormData
} from '../models/TransactionFormModel';
import { ContactLookup } from './contactLookup';
import { PageUtils } from './pageUtils';
import { ApiUtils } from '../utils/api';
import { Intercepts } from '../utils/intercepts';
import { SmokeAliases } from '../utils/aliases';

const TRANSACTION_DETAIL_ALIAS_SOURCE = 'transactionDetailPage';

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
      cy.get('.contact-lookup-container').last().get('[data-cy="searchBox"]').type(formData.candidate);
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
    cy.get(alias).find(amountField).safeType(formData.amount);

    // set interest dropdown and rate
    if (formData.interest_rate_setting) {
      PageUtils.selectDropdownSetValue('[label="INTEREST RATE"]', formData.interest_rate_setting, alias);
      if (formData.interest_rate) {
        cy.get(alias).find('[data-cy="interestRateInput"]:first').safeType(formData.interest_rate);
      }
    }

    if (formData.secured) {
      cy.get(alias).find('input[name="secured"]').first().click({ force: true });
    }

    // Set due date dropdown & date
    if (formData.due_date_setting) {
      cy.get(alias)
        .find('[label="DATE DUE"]:visible')
        .first()
        .as('dateDueField');

      cy.get('@dateDueField').find('select').contains('option', formData.due_date_setting).then(
        (option) => {
          cy.get('@dateDueField').find('select').select(option.val()!);
        }
      );

      if (formData.due_date) {
        cy.get('@dateDueField')
          .closest('.grid')
          .find('[data-cy="dueDateInput"]:visible')
          .first()
          .as('dueDateFieldContainer');

        PageUtils.calendarSetValue('input', formData.due_date, '@dueDateFieldContainer');
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
      cy.get(alias).find('input#line_of_credit').first().click({ force: true });
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

  private static interceptReportTransactionLists(reportId: string) {
    Intercepts.transactionsList({
      alias: SmokeAliases.reportList.receipts(TRANSACTION_DETAIL_ALIAS_SOURCE),
      reportId,
      schedules: 'A',
      includePaging: true,
    });
    Intercepts.transactionsList({
      alias: SmokeAliases.reportList.loans(TRANSACTION_DETAIL_ALIAS_SOURCE),
      reportId,
      schedules: 'C,D',
      includePaging: true,
    });
    Intercepts.transactionsList({
      alias: SmokeAliases.reportList.disbursements(TRANSACTION_DETAIL_ALIAS_SOURCE),
      reportId,
      schedules: 'B,E,F',
      includePaging: true,
    });
  }

  static clickSave(reportId: string) {
    this.interceptReportTransactionLists(reportId);
    cy.contains(/^Save$/).click();
    cy.wait([
      `@${SmokeAliases.reportList.loans(TRANSACTION_DETAIL_ALIAS_SOURCE)}`,
      `@${SmokeAliases.reportList.disbursements(TRANSACTION_DETAIL_ALIAS_SOURCE)}`,
      `@${SmokeAliases.reportList.receipts(TRANSACTION_DETAIL_ALIAS_SOURCE)}`,
    ]);
  }

  static addGuarantor(name: string, amount: number | string, reportId: string) {
    this.interceptReportTransactionLists(reportId);

    // Parent loan save may be create (POST) or update (PUT) based on current test flow.
    cy.intercept({
      method: 'PUT',
      pathname: new RegExp(`^${ApiUtils.apiRoutePathname('/transactions/')}[^/]+/$`),
    }).as(SmokeAliases.transactionDetail.saveParentLoan(TRANSACTION_DETAIL_ALIAS_SOURCE));

    // Alias guarantor creation and parent saves distinctly.
    cy.intercept('POST', ApiUtils.apiRoutePathname('/transactions/'), (req) => {
      if (req.body?.transaction_type_identifier === 'C2_LOAN_GUARANTOR') {
        req.alias = SmokeAliases.transactionDetail.saveGuarantor(TRANSACTION_DETAIL_ALIAS_SOURCE);
      } else {
        req.alias = SmokeAliases.transactionDetail.saveParentLoan(TRANSACTION_DETAIL_ALIAS_SOURCE);
      }
    });

    cy.intercept({
      method: 'GET',
      pathname: ApiUtils.apiRoutePathname('/transactions/'),
      query: { schedules: 'C2', parent: /.+/ },
    }).as(SmokeAliases.transactionDetail.getGuarantors(TRANSACTION_DETAIL_ALIAS_SOURCE));

    PageUtils.clickButton('Save & add loan guarantor');
    cy.wait(`@${SmokeAliases.transactionDetail.saveParentLoan(TRANSACTION_DETAIL_ALIAS_SOURCE)}`);
    cy.contains('Guarantors to loan source').should('exist');

    ContactLookup.getContact(name);
    cy.get('#amount').safeType(amount);
    PageUtils.clickButton('Save & add loan guarantor');
    cy.wait(`@${SmokeAliases.transactionDetail.saveGuarantor(TRANSACTION_DETAIL_ALIAS_SOURCE)}`);
    cy.location('pathname').should((pathname) => {
      const staysOnGuarantorCreate = pathname.includes('create-sub-transaction/C2_LOAN_GUARANTOR');
      expect(staysOnGuarantorCreate).to.be.true;
    });
    PageUtils.clickButton('Cancel');

    cy.wait([
      `@${SmokeAliases.reportList.loans(TRANSACTION_DETAIL_ALIAS_SOURCE)}`,
      `@${SmokeAliases.reportList.disbursements(TRANSACTION_DETAIL_ALIAS_SOURCE)}`,
      `@${SmokeAliases.reportList.receipts(TRANSACTION_DETAIL_ALIAS_SOURCE)}`,
    ]);
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
