import { F3xCreateReportFormData } from '../models/ReportFormModel';
import { PageUtils } from './pageUtils';

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
