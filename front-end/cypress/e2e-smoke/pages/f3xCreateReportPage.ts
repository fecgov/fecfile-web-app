import { F3xCreateReportFormData } from '../models/ReportFormModel';
import { PageUtils } from './pageUtils';

export class F3xCreateReportPage {
  static enterFormData(formData: F3xCreateReportFormData) {
    cy.getByDataCy('report-create-f3x-page-filing-frequency-select').contains(formData['filing_frequency']).click();

    cy.getByDataCy('report-create-f3x-page-report-type-category-select').contains(formData['report_type_category']).click();

    cy.getByDataCy(`report-create-f3x-page-report-code-${formData['report_code']}-radio`).click({ force: true });

    if (['12G', '30G', '12P', '12R', '12S', '12C', '30R', '30S'].includes(formData['report_code'])) {
      PageUtils.calendarSetValue('[data-cy="report-create-f3x-page-date-of-election-date"]', new Date(formData['date_of_election']));
      PageUtils.pSelectDropdownSetValue('[data-cy="report-create-f3x-page-state-of-election-select"]', formData['state_of_election']);
    }

    PageUtils.calendarSetValue('[data-cy="report-create-f3x-page-coverage-from-date-date"]', new Date(formData['coverage_from_date']));
    PageUtils.calendarSetValue('[data-cy="report-create-f3x-page-coverage-through-date-date"]', new Date(formData['coverage_through_date']));
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
