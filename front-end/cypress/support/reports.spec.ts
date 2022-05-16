// @ts-check

import * as _ from 'lodash';

function RandomDate() {
  var outDate = new Date();

  const month = _.random(1, 12);
  outDate.setMonth(month);

  outDate.setDate(0); //Setting the date (day of the month) to '0' sets it to the last day of that month.  Easy way to get the length of the month.
  var day = _.sample(_.range(1, outDate.getDate() + 1));
  day += 1;
  outDate.setDate(day);

  const current_year = outDate.getFullYear();
  const year = _.sample([current_year, current_year + 1, current_year + 2]);
  outDate.setFullYear(year);

  return outDate;
}

function date_to_string(date) {
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  const y = date.getFullYear().toString();

  return `${m}/${d}/${y}`;
}

export function GenerateReportObject(report_given = {}) {
  var report_random = {
    page_1: {
      filing_frequency: _.sample(['MONTHLY', 'QUARTERLY']),
      report_type_category: '',
      report_code: '',
      coverage_from_date: '',
      coverage_through_date: '',
      date_of_election: '',
      state_of_election: '',
    },
    page_2: {
      address_changed: false,
      street_1: '',
      Street_2: '',
      city: '',
      state: '',
      zip: '',
    },
  };

  let report = { ...report_random, ...report_given };

  //    Report Type Category
  if (report['page_1']['report_type_category'] == '') {
    if (report['page_1']['filing_frequency'] == 'QUARTERLY')
      report['page_1']['report_type_category'] = _.sample(['Non-Election Year', 'Election Year', 'Special']);
    else if (report['page_1']['filing_frequency'] == 'MONTHLY')
      report['page_1']['report_type_category'] = _.sample(['Non-Election Year', 'Election Year']);
  }

  //    Report Code
  if (report['page_1']['filing_frequency'] == 'MONTHLY') {
    switch (report['page_1']['report_type_category']) {
      case 'Non-Election Year':
        // prettier-ignore
        report['page_1']['report_code'] = _.sample(['M2','M3','M4','M5','M6','M7','M8','M9','M10','M11','M12','YE','TER',]);
        break;
      case 'Election Year':
        // prettier-ignore
        report['page_1']['report_code'] = _.sample(['M2','M3','M4','M5','M6','M7','M8','M9','M10','12G','30G','YE','TER',]);
        break;
    }
  } else if (report['page_1']['filing_frequency'] == 'QUARTERLY') {
    switch (report['page_1']['report_type_category']) {
      case 'Non-Election Year':
        report['page_1']['report_code'] = _.sample(['Q1', 'MY', 'Q2', 'YE', 'TER']);
        break;
      case 'Election Year':
        report['page_1']['report_code'] = _.sample(['Q1', 'Q2', 'Q3', '12G', '30G', 'YE', 'TER']);
        break;
      case 'Special':
        report['page_1']['report_code'] = _.sample(['12P', '12R', '12C', '12S', '30R', '30S']);
        break;
    }
  }

  const election_date = RandomDate();
  report['page_1']['date_of_election'] = date_to_string(election_date);

  // prettier-ignore
  report['page_1']['state_of_election'] = _.sample([
      'Alabama','Alaska','American Samoa','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Florida','Georgia','Guam','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Northern Mariana Islands','Ohio','Oklahoma','Oregon','Pennsylvania','Puerto Rico','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','U.S. Virgin Islands','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming',
  ])

  var coverage_date = RandomDate();
  report['page_1']['coverage_from_date'] = date_to_string(coverage_date); //Generate a starting date

  var filing_frequency_offset = 0;
  if (report['page_1']['filing_frequency'] == 'QUARTERLY') filing_frequency_offset = 3;
  else if (report['page_1']['filing_frequency'] == 'MONTHLY') filing_frequency_offset = 1;
  coverage_date.setMonth(coverage_date.getMonth() + filing_frequency_offset); //Add 1 or 3 months to the date depending on Monthly/Quarterly filing

  report['page_1']['coverage_through_date'] = date_to_string(coverage_date);

  return report;
}

export function EnterReport(report) {
  cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
  cy.wait(100);

  cy.get('button[label="Create a new report"]').click();
  cy.wait(100);

  cy.get("p-radiobutton[FormControlName='filing_frequency']").contains(report['page_1']['filing_frequency']).click();
  cy.wait(25);

  cy.get("p-selectbutton[FormControlName='report_type_category']")
    .contains(report['page_1']['report_type_category'])
    .click();
  cy.wait(25);

  cy.get("p-radiobutton[FormControlName='report_code']").contains(report['page_1']['report_code']).click();
  cy.wait(25);

  if (
    report['page_1']['report_type_category'] == 'Special' ||
    report['page_1']['report_code'] == '30G' ||
    report['page_1']['report_code'] == '12G'
  ) {
    cy.calendar_set_value(
      "p-calendar[FormControlName='date_of_election']",
      new Date(report['page_1']['date_of_election'])
    );
    cy.wait(25);

    cy.dropdown_set_value("p-dropdown[FormControlName='state_of_election']", report['page_1']['state_of_election']);
    cy.wait(25);
  }

  cy.calendar_set_value(
    "p-calendar[FormControlName='coverage_from_date']",
    new Date(report['page_1']['coverage_from_date'])
  );
  cy.wait(250);
  cy.calendar_set_value(
    "p-calendar[FormControlName='coverage_through_date']",
    new Date(report['page_1']['coverage_through_date'])
  );
  cy.wait(50);
  cy.wait(250);
}
