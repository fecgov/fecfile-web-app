import * as _ from 'lodash';
import { fromPairs } from 'lodash';

export function firstName(): string {
  return _.sample([
    'Khalil',
    'Anika',
    'Demarion',
    'Kenneth',
    'Albert',
    'Ainsley',
    'Brenton',
    'Mira',
    'Kianna',
    'Adalynn',
    'Bentley',
    'Aden',
    'Cristina',
    'Dayanara',
    'Ronan',
    'Makena',
    'Ramon',
    'Gaige',
    'Matilda',
    'Sebastian',
    'Octavio',
    'Walker',
    'Gia',
    'Gloria',
    'Theresa',
  ]);
}

export function middleName(): string {
  return _.sample([
    'Kenzie',
    'Nathaly',
    'Wendy',
    'Deborah',
    'Eve',
    'Raiden',
    'Adam',
    'Teagan',
    'Erika',
    'Levi',
    'Xzavier',
    'Myla',
    'Trystan',
    'Reagan',
    'Barrett',
    'Leroy',
    'Jesus',
    'Adrien',
    'Alexia',
    'Harley',
    'Zaire',
    'Bernard',
    'Kade',
    'Anabelle',
    'Sincere',
  ]);
}

export function lastName(): string {
  return _.sample([
    'Savage',
    'Skinner',
    'Glenn',
    'Barajas',
    'Moreno',
    'King',
    'Meadows',
    'Grimes',
    'Glover',
    'Carrillo',
    'Stephens',
    'Pacheco',
    'Rios',
    'Olsen',
    'Dorsey',
    'Livingston',
    'Mclaughlin',
    'Orozco',
    'Preston',
    'Rush',
    'Malone',
    'Graham',
    'Patton',
    'Middleton',
    'Boyer',
  ]);
}

export function prefix(): string {
  return _.sample(['Dr', '', '', '', '', '', '']); //Extra empty strings artificially raise the likelihood of the value being an empty string
}

export function suffix(): string {
  return _.sample(['Sr', 'Jr', 'III', 'IV', 'V', 'VI', '', '', '', '', '', '', '', '', '', '', '', '', '']);
}

export function street(): string {
  return `${_.random(1, 9999)} Test ${_.sample(['Rd', 'Ln', 'St', 'Ave', 'Ct'])}`;
}

export function apartment(): string {
  return _.sample([`Apt ${_.random(1, 200)}`, '', '']);
}

export function city(): string {
  return _.sample([
    'Testopolis',
    'Testville',
    'Testburg',
    'Testland',
    'Testford',
    'Testham',
    'Testmouth',
    'Testborough',
    'Testbury',
  ]);
}

export function zipcode(): string {
  return _.random(1, 9999).toString().padStart(5, '0'); //Zipcodes starting with 0 are pretty uncommon
}

export const states: string[] = [
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'District of Columbia',
  'Florida',
  'Georgia',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Pennsylvania',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming',
];

export const territories: string[] = [
  'American Samoa',
  'Guam',
  'Northern Mariana Islands',
  'U.S. Virgin Islands',
  'Puerto Rico',
];

export const stateCodes: object = {
  ALABAMA: 'AL',
  ALASKA: 'AK',
  'AMERICAN SAMOA': 'AS',
  ARIZONA: 'AZ',
  ARKANSAS: 'AR',
  CALIFORNIA: 'CA',
  COLORADO: 'CO',
  CONNECTICUT: 'CT',
  DELAWARE: 'DE',
  'DISTRICT OF COLUMBIA': 'DC',
  FLORIDA: 'FL',
  GEORGIA: 'GA',
  GUAM: 'GU',
  HAWAII: 'HI',
  IDAHO: 'ID',
  ILLINOIS: 'IL',
  INDIANA: 'IN',
  IOWA: 'IA',
  KANSAS: 'KS',
  KENTUCKY: 'KY',
  LOUISIANA: 'LA',
  MAINE: 'ME',
  MARYLAND: 'MD',
  MASSACHUSETTS: 'MA',
  MICHIGAN: 'MI',
  MINNESOTA: 'MN',
  MISSISSIPPI: 'MS',
  MISSOURI: 'MO',
  MONTANA: 'MT',
  NEBRASKA: 'NE',
  NEVADA: 'NV',
  'NEW HAMPSHIRE': 'NH',
  'NEW JERSEY': 'NJ',
  'NEW MEXICO': 'NM',
  'NEW YORK': 'NY',
  'NORTH CAROLINA': 'NC',
  'NORTH DAKOTA': 'ND',
  'NORTHERN MARIANA IS': 'MP',
  OHIO: 'OH',
  OKLAHOMA: 'OK',
  OREGON: 'OR',
  PENNSYLVANIA: 'PA',
  'PUERTO RICO': 'PR',
  'RHODE ISLAND': 'RI',
  'SOUTH CAROLINA': 'SC',
  'SOUTH DAKOTA': 'SD',
  TENNESSEE: 'TN',
  TEXAS: 'TX',
  UTAH: 'UT',
  VERMONT: 'VT',
  VIRGINIA: 'VA',
  'VIRGIN ISLANDS': 'VI',
  WASHINGTON: 'WA',
  'WEST VIRGINIA': 'WV',
  WISCONSIN: 'WI',
  WYOMING: 'WY',
};

export function state(theFifty: boolean = true): string {
  if (theFifty) return _.sample(states);
  else return _.sample(states.concat(territories));
}

export function phone(): string {
  return `${_.random(1, 999).toString().padStart(3, '0')}${_.random(1000000, 1999999).toString()}`; //Area code from 001 to 999 || 7-digit number starting with between 100 to 199 because (supposedly) that range always corresponds to fake numbers
}

export function occupation(): string {
  return _.sample([
    'Police Officer',
    'Radiologic Technologist',
    'Accountant',
    'Statistician',
    'Surveyor',
    'Physician',
    'Teacher',
    'Microbiologist',
    'Insurance Agent',
    'Economist',
    'Childcare worker',
    'Automotive mechanic',
    'Physical Therapist',
    'Coach',
    'Librarian',
    'Painter',
    'High',
    'Software Engineer',
    'Editor',
    'Interpreter',
    'Chef',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
  ]);
}

export function candidateOffice(): string {
  return _.sample(['House', 'Presidential', 'Senate']);
}

export function candidateID(candidateOffice: string): string {
  return `${candidateOffice[0]}${_.random(1, 99999999).toString().padStart(8, '0')}`;
}

export function committeeID(): string {
  return `C${_.random(1, 99999999).toString().padStart(8, '0')}`;
}

export function groupName(): string {
  return `${_.sample(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'])} for American ${_.sample([
    'Happiness',
    'Exceptionalism',
    'Integrity',
    'Unity',
    'Prosperity',
  ])}`;
}

export function date(): Date {
  let outDate: Date = new Date();

  const month: number = _.random(1, 12);
  outDate.setMonth(month);

  outDate.setDate(0); //Setting the date (day of the month) to '0' sets it to the last day of that month.  Easy way to get the length of the month.
  let day: number = _.sample(_.range(1, outDate.getDate() + 1));
  day += 1;
  outDate.setDate(day);

  const currentYear: number = outDate.getFullYear();
  const year: number = _.random(currentYear, currentYear + 3);
  outDate.setFullYear(year);

  return outDate;
}

export function f3xFilingFrequency(): string {
  return _.sample(['MONTHLY', 'QUARTERLY']);
}

export const f3xReportCategories: object = {
  QUARTERLY: ['Non-Election Year', 'Election Year', 'Special'],
  MONTHLY: ['Non-Election Year', 'Election Year'],
};
export function f3xReportCategory(filingFrequency: string): string {
  //    Report Type Category
  if (filingFrequency in f3xReportCategories) return _.sample(f3xReportCategories[filingFrequency]);
  else return `Invalid Filing Frequency: ${filingFrequency}`;
}

export const f3xReportCodes: object = {
  MONTHLY: {
    'Non-Election Year': ['M1', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11', 'M12', 'YE', 'TER'],
    'Election Year': ['M1', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', '12G', '30G', 'YE', 'TER'],
  },
  QUARTERLY: {
    'Non-Election Year': ['Q1', 'MY', 'Q2', 'YE', 'TER'],
    'Election Year': ['Q1', 'Q2', 'Q3', '12G', '30G', 'YE', 'TER'],
    Special: ['11P', '12R', '12C', '12S', '30R', '30S'],
  },
};
export function f3xReportCode(filingFrequency: string, reportCategory: string): string {
  if (filingFrequency in f3xReportCodes) {
    if (reportCategory in f3xReportCodes[filingFrequency]) {
      return _.sample(f3xReportCodes[filingFrequency][reportCategory]);
    } else {
      return `Invalid Report Category: ${reportCategory}`;
    }
  } else {
    return `Invalid Filing Frequency: ${filingFrequency}`;
  }
}

export function f3xCoverageThroughDate(coverageFromDate: string, filingFrequency: string = 'MONTHLY'): Date {
  //Coverage Through Date
  let coverageDate: Date = new Date(coverageFromDate);
  let filingFrequencyOffset: number = 0;

  if (filingFrequency == 'QUARTERLY') filingFrequencyOffset = 3;
  else if (filingFrequency == 'MONTHLY') filingFrequencyOffset = 1;

  coverageDate.setMonth(coverageDate.getMonth() + filingFrequencyOffset); //Add 1 or 3 months to the date depending on Monthly/Quarterly filing
  return coverageDate;
}

export function transactionDateReceived(coverageFromDate: string = '', coverageThroughDate: string = ''): Date {
  if (coverageFromDate == '' || coverageThroughDate == '') return date();

  let fromDate = new Date(coverageFromDate);
  let throughDate = new Date(coverageThroughDate);
  let outDate = new Date();

  let year: number = _.random(fromDate.getFullYear(), throughDate.getFullYear());
  outDate.setFullYear(year);

  let month: number;
  let day: number;

  if (fromDate.getFullYear() == throughDate.getFullYear()) {
    month = _.random(fromDate.getMonth(), throughDate.getMonth());
  } else if (year == fromDate.getFullYear()) {
    month = _.random(fromDate.getMonth(), 11);
  } else if (year == throughDate.getFullYear()) {
    month = _.random(throughDate.getMonth());
  } else {
    month = _.random(11);
  }
  outDate.setMonth(month);
  outDate.setDate(0); //Setting the day to '0' sets it to the last day of the month

  if (fromDate.getMonth() == throughDate.getMonth()) {
    day = _.random(fromDate.getDate(), throughDate.getDate());
  } else if (month == fromDate.getMonth()) {
    day = _.random(fromDate.getDate(), outDate.getDate());
  } else if (month == throughDate.getMonth()) {
    day = _.random(throughDate.getDate());
  } else {
    day = _.random(outDate.getDate());
  }
  outDate.setDate(day);

  return outDate;
}
