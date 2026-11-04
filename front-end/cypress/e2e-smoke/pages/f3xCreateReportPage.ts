import { F3xCreateReportFormData } from '../models/ReportFormModel';
import { PageUtils } from './pageUtils';

export class F3xCreateReportPage {
  static enterFormData(formData: F3xCreateReportFormData) {
    cy.get("[data-cy='filing-frequency']").contains(formData['filing_frequency']).click();

    cy.get("[data-cy='report-type-category']")
      .contains('.p-togglebutton', formData['report_type_category'])
      .then(($btn) => {
        if ($btn.attr('aria-pressed') !== 'true') {
          cy.wrap($btn).click();
        }
      });

    cy.get(`#${formData['report_code']}`).click();

    if (['12G', '30G', '12P', '12R', '12S', '12C', '30R', '30S'].includes(formData['report_code'])) {
      PageUtils.calendarSetValue('[data-cy="date-of-election"]', new Date(formData['date_of_election']));
      PageUtils.pSelectDropdownSetValue('[data-cy="state-of-election"]', formData['state_of_election']);
    }

    PageUtils.calendarSetValue('[data-cy="coverage-from-date"]', new Date(formData['coverage_from_date']));
    PageUtils.calendarSetValue('[data-cy="coverage-through-date"]', new Date(formData['coverage_through_date']));
  }

  static coverageCall() {
    return cy
      .intercept({ method: 'GET', url: 'http://localhost:8080/api/v1/reports/form-3x/coverage_dates/' })
      .as('coverageDates');
  }
  static waitForCoverage() {
    cy.wait('@coverageDates'); // the page is ready when coverage_dates has returned
  }
}
