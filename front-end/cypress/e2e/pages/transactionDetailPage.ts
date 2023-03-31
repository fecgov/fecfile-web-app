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

  static assertFormData(formData: ScheduleFormData) {}
}
