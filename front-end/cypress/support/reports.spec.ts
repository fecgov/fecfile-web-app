// @ts-check

import { getAuthToken } from './commands';

export type FilingFrequency = "QUARTERLY" | "MONTHLY";
export type FilingType = "Election Year" | "Non-Election Year";
export type FilingFrequencyTree = {
  [frequencyKey in FilingFrequency]: {
    [typeKey in FilingType]: {
      [fieldKey: string] : boolean
    }
  }
}

export const filingFrequencyTree: FilingFrequencyTree = {
  //Defines the structure of the Report Type radiobuttons and whether or not each button should be connected to the "State" dropdown and "Election On" date picker
  QUARTERLY: {
    'Election Year': {
      Q1: false,
      Q2: false,
      Q3: false,
      '12G': true,
      '30G': true,
      '(YE)': false,
      '12P': true,
      '12R': true,
      '12S': true,
      '12C': true,
      '30R': true,
      '30S': true,
      '(TER)': false,
    },
    'Non-Election Year': {
      MY: false,
      '(YE)': false,
      '12P': true,
      '12R': true,
      '12S': true,
      '12C': true,
      '30R': true,
      '30S': true,
      '(TER)': false,
    },
  },
  MONTHLY: {
    'Election Year': {
      M2: false,
      M3: false,
      M4: false,
      M5: false,
      M6: false,
      M7: false,
      M8: false,
      M9: false,
      M10: false,
      '12G': true,
      '30G': true,
      '(YE)': false,
      '(TER)': false,
    },
    'Non-Election Year': {
      M2: false,
      M3: false,
      M4: false,
      M5: false,
      M6: false,
      M7: false,
      M8: false,
      M9: false,
      M10: false,
      M11: false,
      M12: false,
      '(YE)': false,
      '(TER)': false,
    },
  },
};

export function dateToString(dateObj: Date): string {
  const m: string = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const d: string = dateObj.getDate().toString().padStart(2, '0');
  const y: string = dateObj.getFullYear().toString();

  return `${m}/${d}/${y}`;
}

export function createReport(report, save = true) {
  cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
  cy.medWait();

  cy.get('button[label="Create a new report"]').click();
  cy.medWait();

  cy.get("p-radiobutton[FormControlName='filing_frequency']").contains(report['filing_frequency']).click();
  cy.shortWait();

  cy.get("p-selectbutton[FormControlName='report_type_category']").contains(report['report_type_category']).click();
  cy.shortWait();

  cy.get("p-radiobutton[FormControlName='report_code']").contains(report['report_code']).click();
  cy.shortWait();

  if (report['report_type_category'] == 'Special' || report['report_code'] == '30G' || report['report_code'] == '12G') {
    cy.calendarSetValue("p-calendar[FormControlName='date_of_election']", new Date(report['date_of_election']));
    cy.shortWait();

    cy.dropdownSetValue("p-dropdown[FormControlName='state_of_election']", report['state_of_election']);
    cy.shortWait();
  }

  cy.calendarSetValue("p-calendar[FormControlName='coverage_from_date']", new Date(report['coverage_from_date']));
  cy.medWait();
  cy.calendarSetValue("p-calendar[FormControlName='coverage_through_date']", new Date(report['coverage_through_date']));
  cy.medWait();

  if (save) {
    cy.get("button[label='Save']").click();
    cy.longWait();
  }
}

export function progressReport(address_details = null) {
  if (address_details == null) {
    cy.get("p-radiobutton[formControlName='change_of_address']")
      .contains('p-radiobutton', 'NO')
      .find('.p-radiobutton-box')
      .click();
    cy.shortWait();
  } else {
    cy.get("p-radiobutton[formControlName='change_of_address']")
      .contains('p-radiobutton', 'YES')
      .find('.p-radiobutton-box')
      .click();
    cy.shortWait();

    cy.get("input[formControlName='street_1']").safeType(address_details['street']);
    cy.get("input[formControlName='street_2']").safeType(address_details['apartment']);
    cy.get("input[formControlName='city']").safeType(address_details['city']);
    cy.get("input[formControlName='zip']").safeType(address_details['zip']);
    cy.dropdownSetValue("p-dropdown[formControlName='state']", address_details['state']);
  }

  cy.get("button[label='Save and continue']").click();
  cy.longWait();
}

export function navigateReportSidebar(type: "Transaction" | "Submit" | "Review", link: string){
  cy.get("p-panelmenu")
    .contains(type.toUpperCase()).click();
  
  cy.shortWait();
  cy.get("p-panelmenu")
    .contains("a", link)
    .click();
}

//Deletes all reports belonging to the logged-in committee
export function deleteAllReports() {
  const authToken: string = getAuthToken();
  cy.request({
    method: 'GET',
    url: 'http://localhost:8080/api/v1/f3x-summaries/',
    headers: {
      Authorization: authToken,
    },
  }).then((resp) => {
    const reports = resp.body.results;
    for (const report of reports) {
      deleteReport(report.id, authToken);
    }
    cy.longWait();
  });
}

//Deletes a single report by its ID
export function deleteReport(reportID: number, authToken: string | null = null) {
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
