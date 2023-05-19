import { currentYear, PageUtils } from './pageUtils';

export type ScheduleFormData = {
  date_received: Date;
  memo_code: boolean;
  amount: number;
  electionType: string; // electionType and electionYear are composite form data for election_code
  electionYear: number;
  election_other_description: string;
  purpose_description: string;
  memo_text: string;
  category_code: string;
};

export const defaultFormData: ScheduleFormData = {
  date_received: new Date(currentYear, 4 - 1, 27),
  memo_code: false,
  amount: 100.55,
  electionType: '',
  electionYear: 0,
  election_other_description: '',
  purpose_description: PageUtils.randomString(20),
  memo_text: PageUtils.randomString(20),
  category_code: '',
};

export class TransactionDetailPage {
  static enterFormData(formData: ScheduleFormData, readOnlyAmount = false, alias = '') {
    alias = PageUtils.getAlias(alias);

    PageUtils.calendarSetValue('p-calendar[inputid="date"]', formData['date_received'], alias);
    if (formData['memo_code']) {
      cy.get(alias).find('p-checkbox[inputid="memo_code"]').click();
    }
    if (!readOnlyAmount) {
      cy.get(alias).find('input#amount').safeType(formData['amount']);
    }
    if (formData['electionType']) {
      PageUtils.dropdownSetValue('[inputid="electionType"]', formData['electionType'], alias);
    }
    if (formData['electionYear']) {
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

  static assertFormData(formData: ScheduleFormData, alias = '') {
    alias = PageUtils.getAlias(alias);

    cy.get(alias).find('#date').should('have.value', PageUtils.dateToString(formData['date_received']));
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
