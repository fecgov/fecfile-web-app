import * as _ from 'lodash';

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
  ]) as string;
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
  ]) as string;
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
  ]) as string;
}

export function prefix(): string {
  return _.sample(['Dr', '', '', '', '', '', '']) as string; //Extra empty strings artificially raise the likelihood of the value being an empty string
}

export function suffix(): string {
  return _.sample(['Sr', 'Jr', 'III', 'IV', 'V', 'VI', '', '', '', '', '', '', '', '', '', '', '', '', '']) as string;
}

export function street(): string {
  return `${_.random(1, 9999)} Test ${_.sample(['Rd', 'Ln', 'St', 'Ave', 'Ct'])}`;
}

export function apartment(): string {
  return _.sample([`Apt ${_.random(1, 200)}`, '', '']) as string;
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
  ]) as string;
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

export function state(theFifty = true): string {
  if (theFifty) return _.sample(states) as string;
  else return _.sample(states.concat(territories)) as string;
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
  ]) as string;
}

export function employer(): string {
  return _.sample([
    'University of Testopolis',
    'Testville Mall',
    'Smith, Smith, and Smith',
    'Big eCommerce Platform',
    'Testville Library',
    'Testville City Hall',
    'Testopolis District Court',
    'Testopolis PD',
    'Testville High',
    'Jorgensen Deli',
    'Namebrand Automotive Inc.'
  ]) as string;
}

export function candidateOffice(): string {
  return _.sample(['House', 'Presidential', 'Senate']) as string;
}

export function candidateID(candidateOfficeName: string): string {
  const letter = candidateOfficeName[0];
  if (letter == 'H' || letter == 'S') {
    const randomLetterCode = _.sample(Object.values(stateCodes));
    const endCode = _.random(0, 99999).toString().padStart(5, '0');
    return `${letter}${_.random(0, 9)}${randomLetterCode}${endCode}`;
  }
  return `${letter}${_.random(1, 99999999).toString().padStart(8, '0')}`;
}

export function committeeID(): string {
  return `C${_.random(1, 99999999).toString().padStart(8, '0')}`;
}

export function groupName(): string {
  return `${randomString(6, "alphabet")} for American ${_.sample([
    'Happiness',
    'Exceptionalism',
    'Integrity',
    'Unity',
    'Prosperity',
  ])}`;
}

export function email(): string {
  if (_.random(100) % 2 == 0){
    return firstName()+lastName()+`@test${_.random(999)}.com`;
  } else {
    return groupName().replaceAll(" ", "_")+'@test.com';
  }
}

export function fakeFilingPW(): string {
  let outString: string = randomString(1, "alphabet").toUpperCase();
  outString += randomString(1, "alphabet").toLowerCase();
  outString += randomString(1, "numeric");
  outString += _.sample(['!','@','#','$','%','&','*','(',')']); //The symbols required to be present are more restrictive

  const length = _.random(8, 16);
  outString += randomString(length-outString.length, "special");

  return outString
}

export function date(): Date {
  const outDate: Date = new Date();

  const month: number = _.random(1, 12);
  outDate.setMonth(month);

  outDate.setDate(0); //Setting the date (day of the month) to '0' sets it to the last day of that month.  Easy way to get the length of the month.
  let day: number | undefined = _.sample(_.range(1, outDate.getDate() + 1));
  if (day) {
    day += 1;
    outDate.setDate(day);
  }

  const currentYear: number = outDate.getFullYear();
  const year: number = _.random(currentYear, currentYear + 3);
  outDate.setFullYear(year);

  return outDate;
}

export function f3xFilingFrequency(): string {
  return _.sample(['MONTHLY', 'QUARTERLY']) as string;
}

export const f3xReportCategories: object = {
  QUARTERLY: ['Non-Election Year', 'Election Year'],
  MONTHLY: ['Non-Election Year', 'Election Year'],
};
export function f3xReportCategory(filingFrequency: string): string {
  //    Report Type Category
  if (filingFrequency in f3xReportCategories) return _.sample(f3xReportCategories[filingFrequency]) as string;
  else return `Invalid Filing Frequency: ${filingFrequency}`;
}

export const f3xReportCodes: object = {
  MONTHLY: {
    'Non-Election Year': ['M1', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11', 'M12', 'YE', '(TER)'],
    'Election Year': ['M1', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', '12G', '30G', 'YE', '(TER)'],
  },
  QUARTERLY: {
    'Non-Election Year': ['MY', 'YE', '12P', '12R', '12S', '12C', '30R', '30S', '(TER)'],
    'Election Year': ['Q1', 'Q2', 'Q3', '12G', '30G', 'YE', '12P', '12R', '12S', '12C', '30R', '30S', '(TER)'],
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

export function f3xCoverageThroughDate(coverageFromDate: string, filingFrequency = 'MONTHLY'): Date {
  //Coverage Through Date
  const coverageDate: Date = new Date(coverageFromDate);
  let filingFrequencyOffset = 0;

  if (filingFrequency == 'QUARTERLY') filingFrequencyOffset = 3;
  else if (filingFrequency == 'MONTHLY') filingFrequencyOffset = 1;

  coverageDate.setMonth(coverageDate.getMonth() + filingFrequencyOffset); //Add 1 or 3 months to the date depending on Monthly/Quarterly filing
  return coverageDate;
}

export function transactionDateReceived(coverageFromDate = '', coverageThroughDate = ''): Date {
  if (coverageFromDate == '' || coverageThroughDate == '') return date();

  const fromDate = new Date(coverageFromDate);
  const throughDate = new Date(coverageThroughDate);
  const outDate = new Date();

  const year: number = _.random(fromDate.getFullYear(), throughDate.getFullYear());
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

export function randomString(
  strLength: number,
  charType: 'special' | 'alphanumeric' | 'alphabet' | 'numeric' | 'symbols' = 'alphanumeric',
  includeCurlyBraces = true
): string {
  // prettier-ignore
  let symbols: Array<string> = [' ', '!', '"', '#', '$', '%', '&', "'", '(', ')', '*', '+', ',', '-', '.', '/', '|', '~', '`'];
  if (includeCurlyBraces) symbols = symbols.concat('{','}');
  // prettier-ignore
  const alphabet: Array<string> =   ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',];
  // prettier-ignore
  const numeric: Array<string> = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  
  const alphanumeric = alphabet.concat(numeric);
  const special = alphanumeric.concat(symbols);

  let characters: Array<string> = [];
  if (charType == 'special') {
    characters = special;
  } else if (charType == 'alphanumeric') {
    characters = alphanumeric;
  } else if (charType == 'numeric') {
    characters = numeric;
  } else if (charType == 'alphabet') {
    characters = alphabet;
  } else if (charType == 'symbols') {
    characters = symbols;
  } else {
    console.log('RandomString: Invalid charType');
    return '';
  }

  let outString = '';
  while (outString.length < strLength) {
    outString += _.sample(characters);
  }
  /*
   *  Cypress uses {} to escape the previous character.
   *  This is necessary to avoid accidentally passing
   *  cypress a command
   */
  return outString.replaceAll('{', '{{}');
}
