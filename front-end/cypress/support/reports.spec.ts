// @ts-check

import * as _ from 'lodash';
import { getAuthToken } from './commands';
import { date } from './generators/generators.spec';
import { ConfirmationDetails, FilingDetails } from './generators/reports.spec';

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

  cy.url().then((url: string)=>{
    if (url.includes("cash-on-hand")){
      progressCashOnHand();
    }
  })
  cy.longWait();
}

type cohDetailType = {
  cashOnHand?: number,
  date?: Date,
}

export function enterConfirmationDetails(details: ConfirmationDetails, save=true){
  cy.get('input[formControlName="confirmation_email_1"]').overwrite(details.email_1);

  if (details.email_2){
    cy.get('input[formControlName="confirmation_email_2"]').overwrite(details.email_2);
  }

  if (details.street_1){
    cy.get('p-radiobutton[label="YES"]').find('div').last().click({force: true});

    cy.get('input[formControlName="street_1"]').overwrite(details.street_1);
    cy.get('input[formControlName="street_2"]').overwrite(details.street_2);
    cy.get('input[formControlName="city"]').overwrite(details.city);
    cy.get('input[formControlName="zip"]').overwrite(details.zip);
    cy.dropdownSetValue('p-dropdown[formControlName="state"]', details.state);
  }

  cy.shortWait();
  if (save){
    cy.get('button[label="Confirm information"]').click();
    cy.medWait();
  }
}

export function enterFilingDetails(details: FilingDetails, save=true){
  cy.get('input[formControlName="treasurer_first_name"]').overwrite(details.first_name);
  cy.get('input[formControlName="treasurer_last_name"]').overwrite(details.last_name);
  cy.get('input[formControlName="treasurer_middle_name"]').overwrite(details.middle_name);
  cy.get('input[formControlName="treasurer_prefix"]').overwrite(details.prefix);
  cy.get('input[formControlName="treasurer_suffix"]').overwrite(details.suffix);
  cy.get('input[formControlName="filing_password"]').overwrite(details.filing_pw);

  cy.get('p-checkbox[formControlName="truth_statement"]').find('div').last().click({force:true});

  cy.shortWait();
  if (save){
    cy.get('button[label="Submit"]').click();
    cy.shortWait();
    cy.contains('button', 'Yes').click();
    cy.medWait();
  }
}

export function progressCashOnHand(cohDetails: cohDetailType | null = null){
  if (cohDetails === null){
    cohDetails = {
      cashOnHand: _.random(1,99999, false),
      date: date(),
    }
  } else {
    if (!('cashOnHand' in cohDetails)){
      cohDetails.cashOnHand = _.random(1,99999, false);
    }
    if (!('date' in cohDetails)){
      cohDetails.date = date();
    }
  }

  cy.get('p-inputnumber[formcontrolname="L6a_cash_on_hand_jan_1_ytd"]')
    .safeType(cohDetails.cashOnHand);
  cy.calendarSetValue('p-calendar[formcontrolname="cash_on_hand_date"]', cohDetails.date);
  cy.medWait();
  
  cy.get('button[label="Save & continue"]').click();
}



/**
 * navigateToTransactionManagement
 * 
 * Use this method when on the reports management page to select a report and
 * navigate to its transaction management page.  You may provide additional
 * details to aid in choosing a specific report.  The targeted report must be
 * on the page.
 * 
 * If this method is called on the report creation (step 2) or cash-on-hand pages,
 * it will also navigate to the transaction management page for the active report.
 * 
 * Otherwise, this function will choose the first report on the list.
 * 
 * @param identifyingDetails Null or object with the following optional attributes:
 *   - formType: string,
 *   - reportCode: string,
 *   - coverageDates: [Date, Date],
 *   - status: string,
 *   - version: string,
 *   - filed: Date,
 */
export function navigateToTransactionManagement(identifyingDetails: null | {
  formType?: string,
  reportCode?: string,
  coverageDates?: [Date, Date],
  status?: string,
  version?: string,
  filed?: Date
} = null) {

  cy.shortWait();
  cy.url().then((url: string)=>{
    if (url.includes("step2")){
      cy.then(progressReport);
      cy.navigateToTransactionManagement(identifyingDetails);
    }
    else if (url.includes("cash-on-hand")){
      cy.get('button[label="Skip for now"]').click();
      cy.navigateToTransactionManagement(identifyingDetails);
    }
    else if (url.includes("/reports") && !url.includes("list")){
      chooseAReport(identifyingDetails);
      cy.navigateToTransactionManagement(identifyingDetails);
    }
  })
}

function chooseAReport(identifyingDetails: null | {
  formType?: string,
  reportCode?: string,
  coverageDates?: [Date, Date],
  status?: string,
  version?: string,
  filed?: Date
} = null){
  let reportContains: Partial<any>[] = [];
  if (identifyingDetails != null){
    if (identifyingDetails.formType)
      reportContains = reportContains.concat([identifyingDetails.formType]);
    if (identifyingDetails.reportCode)
      reportContains = reportContains.concat([identifyingDetails.reportCode]);
    if (identifyingDetails.coverageDates){
      const dates = identifyingDetails.coverageDates;
      reportContains = reportContains.concat([dateToString(dates[0])]);
      reportContains = reportContains.concat([dateToString(dates[1])]);
    }
    if (identifyingDetails.status)
      reportContains = reportContains.concat([identifyingDetails.status]);
    if (identifyingDetails.version)
      reportContains = reportContains.concat([identifyingDetails.version]);
    if (identifyingDetails.filed){
      const date = identifyingDetails.filed;
      reportContains = reportContains.concat([dateToString(date)]);
    }
  }

  if (reportContains.length > 0){
    cy.get('tbody').contains("tr", ...reportContains)
      .first()
      .find('p-button[icon="pi pi-pencil"]')
      .click();
  } else {
    cy.get('tbody').find('tr').first().find('p-button[icon="pi pi-pencil"]').click();
  }
  
  cy.medWait();
}

export function navigateReportSidebar(type: "Transaction" | "Submit" | "Review", link: string){
  //Makes sure that we don't accidentally *close* the accordion we want
  if (type === "Transaction"){
    cy.get("p-panelmenu").contains("SUBMIT").click();
  } else {
    cy.get("p-panelmenu").contains("TRANSACTION").click();
  }
  cy.shortWait();

  cy.get("p-panelmenu")
    .contains(type.toUpperCase()).click();
  
  cy.shortWait();
  cy.get("p-panelmenu")
    .contains("a", link)
    .click();
  cy.medWait();
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
