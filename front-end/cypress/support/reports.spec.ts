// @ts-check

import * as _ from 'lodash';
import { getAuthToken } from './commands';

export function dateToString(dateObj: Date): string {
  const m: string = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const d: string = dateObj.getDate().toString().padStart(2, '0');
  const y: string = dateObj.getFullYear().toString();

  return `${m}/${d}/${y}`;
}

export function enterReport(report, save = true) {
  cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
  cy.wait(100);

  cy.get('button[label="Create a new report"]').click();
  cy.wait(100);

  cy.get("p-radiobutton[FormControlName='filing_frequency']").contains(report['filing_frequency']).click();
  cy.wait(25);

  cy.get("p-selectbutton[FormControlName='report_type_category']").contains(report['report_type_category']).click();
  cy.wait(25);

  cy.get("p-radiobutton[FormControlName='report_code']").contains(report['report_code']).click();
  cy.wait(25);

  if (report['report_type_category'] == 'Special' || report['report_code'] == '30G' || report['report_code'] == '12G') {
    cy.calendarSetValue("p-calendar[FormControlName='date_of_election']", new Date(report['date_of_election']));
    cy.wait(25);

    cy.dropdownSetValue("p-dropdown[FormControlName='state_of_election']", report['state_of_election']);
    cy.wait(25);
  }

  cy.calendarSetValue("p-calendar[FormControlName='coverage_from_date']", new Date(report['coverage_from_date']));
  cy.wait(250);
  cy.calendarSetValue("p-calendar[FormControlName='coverage_through_date']", new Date(report['coverage_through_date']));
  cy.wait(50);
  cy.wait(250);

  if (save) {
    cy.get("button[label='Save']").click();
    cy.wait(50);
  }
}

//Deletes all reports belonging to the logged-in committee
export function deleteAllReports() {
  let authToken: string = getAuthToken();
  cy.request({
    method: 'GET',
    url: 'http://localhost:8080/api/v1/f3x-summaries/',
    headers: {
      Authorization: authToken,
    },
  }).then((resp) => {
    let reports = resp.body.results;
    for (let report of reports) {
      deleteReport(report.id, authToken);
    }
  });
}

//Deletes a single report by its ID
export function deleteReport(reportID: number, authToken: string = null) {
  if (authToken == null) {
    authToken = getAuthToken();
  }

  cy.request({
    method: 'DELETE',
    url: `http://localhost:8080/api/v1/f3x-summaries/${reportID}/`,
    headers: {
      Authorization: authToken,
    },
  });
}
