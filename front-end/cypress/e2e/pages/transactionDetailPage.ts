import { currentYear, PageUtils } from './pageUtils';

export type ScheduleFormData = {
  date_received: Date;
  memo_code: boolean;
  amount: number;
  purpose_description: string;
  memo_text: string;
  category_code: string;
};

export const defaultFormData: ScheduleFormData = {
  date_received: new Date(currentYear, 7 - 1, 27),
  memo_code: false,
  amount: 100.55,
  purpose_description: PageUtils.randomString(20),
  memo_text: PageUtils.randomString(20),
  category_code: '',
};

export class TransactionDetailPage {
  static enterFormData(formData: ScheduleFormData) {
    PageUtils.calendarSetValue('p-calendar[inputid="date"]', formData['date_received']);
    if (formData['memo_code']) {
      cy.get('p-checkbox[inputid="memo_code"]').click();
    }
    cy.get('input#amount').safeType(formData['amount']);
    if (formData['purpose_description']) {
      cy.get('textarea#purpose_description').safeType(formData['purpose_description']);
    }
    cy.get('textarea#memo_text_input').safeType(formData['memo_text']);
    if (formData['category_code']) {
      PageUtils.dropdownSetValue('[inputid="category_code"]', formData['category_code']);
    }
  }

  static assertFormData(formData: ScheduleFormData) {
    cy.get('#date').should('have.value', PageUtils.dateToString(formData['date_received']));
    cy.get('#memo_code').should('have.attr', 'aria-checked', formData['memo_code'] ? 'true' : 'false');
    cy.get('#purpose_description').should('have.value', formData['purpose_description']);
    cy.get('#memo_text_input').should('have.value', formData['memo_text']);

    const amount = formData['amount'] < 0 ? '-$' + -1 * formData['amount'] : '$' + formData['amount'];
    cy.get('#amount').should('have.value', amount);

    if (formData['category_code']) {
      cy.get('[inputid="category_code"]').should('contain', formData['category_code']);
    }
  }
}
