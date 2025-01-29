import { F3xCreateReportFormData } from '../models/ReportFormModel';
import { PageUtils } from './pageUtils';

export class F3xCreateReportPage {
  static enterFormData(formData: F3xCreateReportFormData) {
    cy.get("[data-cy='filing_frequency']").contains(formData['filing_frequency']).click();

    cy.get("[data-cy='report-type-category']").contains(formData['report_type_category']).click();

    cy.get(`#${formData['report_code']}`).click({ force: true });

    if (['12G', '30G', '12P', '12R', '12S', '12C', '30R', '30S'].includes(formData['report_code'])) {
      PageUtils.calendarSetValue('[data-cy="date_of_election"]', new Date(formData['date_of_election']));
      PageUtils.dropdownSetValue('[data-cy="state_of_election"]', formData['state_of_election']);
    }

    PageUtils.calendarSetValue('[data-cy="coverage_from_date"]', new Date(formData['coverage_from_date']));
    PageUtils.calendarSetValue('[data-cy="coverage_through_date"]', new Date(formData['coverage_through_date']));
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
