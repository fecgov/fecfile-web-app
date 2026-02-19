import { F3xCreateReportFormData } from '../models/ReportFormModel';
import { PageUtils } from './pageUtils';
import { ApiUtils } from '../utils/api';
import { SmokeAliases } from '../utils/aliases';

const F3X_CREATE_REPORT_ALIAS_SOURCE = 'f3xCreateReportPage';

export class F3xCreateReportPage {
  static enterFormData(formData: F3xCreateReportFormData) {
    cy.get("[data-cy='filing_frequency']").contains(formData['filing_frequency']).click();

    cy.get("[data-cy='report-type-category']").contains(formData['report_type_category']).click();

    cy.get(`#${formData['report_code']}`).click({ force: true });

    if (['12G', '30G', '12P', '12R', '12S', '12C', '30R', '30S'].includes(formData['report_code'])) {
      PageUtils.calendarSetValue('[data-cy="date_of_election"]', new Date(formData['date_of_election']));
      PageUtils.pSelectDropdownSetValue('[data-cy="state_of_election"]', formData['state_of_election']);
    }

    PageUtils.calendarSetValue('[data-cy="coverage_from_date"]', new Date(formData['coverage_from_date']));
    PageUtils.calendarSetValue('[data-cy="coverage_through_date"]', new Date(formData['coverage_through_date']));
  }

  static coverageCall() {
    return cy
      .intercept({
        method: 'GET',
        pathname: ApiUtils.apiRoutePathname('/reports/form-3x/coverage_dates/'),
      })
      .as(SmokeAliases.network.named('coverageDates', F3X_CREATE_REPORT_ALIAS_SOURCE));
  }
  static waitForCoverage() {
    cy.wait(`@${SmokeAliases.network.named('coverageDates', F3X_CREATE_REPORT_ALIAS_SOURCE)}`); // the page is ready when coverage_dates has returned
  }
}
