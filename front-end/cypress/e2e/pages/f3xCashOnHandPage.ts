import { currentYear, PageUtils } from './pageUtils';

export type F3xCashOnHandFormData = {
  cashOnHand: string;
  date: Date;
};

export const defaultFormData: F3xCashOnHandFormData = {
  cashOnHand: '5000',
  date: new Date(currentYear, 5 - 1, 2),
};

export class F3xCashOnHandPage {
  static enterFormData(formData: F3xCashOnHandFormData) {
    cy.get('app-input-number[formcontrolname="L6a_cash_on_hand_jan_1_ytd"]').safeType(formData['cashOnHand']);
    PageUtils.calendarSetValue('p-calendar[formcontrolname="cash_on_hand_date"]', formData['date']);
  }
}
