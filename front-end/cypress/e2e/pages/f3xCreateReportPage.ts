import { currentYear, PageUtils } from './pageUtils';

export type F3xCreateReportFormData = {
  filing_frequency: string;
  report_type_category: string;
  report_code: string;
  coverage_from_date: Date;
  coverage_through_date: Date;
  date_of_election: Date;
  state_of_election: string;
};

export const defaultFormData: F3xCreateReportFormData = {
  filing_frequency: 'Q', // Q, M
  report_type_category: 'Election Year',
  report_code: '12G',
  coverage_from_date: new Date(currentYear, 4 - 1, 1),
  coverage_through_date: new Date(currentYear, 4 - 1, 30),
  date_of_election: new Date(currentYear, 11 - 1, 4),
  state_of_election: 'California',
};

export class F3xCreateReportPage {
  static enterFormData(formData: F3xCreateReportFormData) {
    cy.get("p-radiobutton[FormControlName='filing_frequency']").contains(formData['filing_frequency']).click();

    cy.get('app-select-button[data-test="report-type-category"]').contains(formData['report_type_category']).click();

    cy.get("p-radiobutton[FormControlName='report_code']").contains(formData['report_code']).click();

    if (['12G', '30G', '12P', '12R', '12S', '12C', '30R', '30S'].includes(formData['report_code'])) {
      PageUtils.calendarSetValue(
        "p-calendar[FormControlName='date_of_election']",
        new Date(formData['date_of_election'])
      );

      PageUtils.dropdownSetValue("p-dropdown[FormControlName='state_of_election']", formData['state_of_election']);
    }

    PageUtils.calendarSetValue(
      "p-calendar[FormControlName='coverage_from_date']",
      new Date(formData['coverage_from_date'])
    );
    PageUtils.calendarSetValue(
      "p-calendar[FormControlName='coverage_through_date']",
      new Date(formData['coverage_through_date'])
    );
  }
}
