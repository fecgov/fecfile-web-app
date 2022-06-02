import * as _ from 'lodash';

export function firstName() {
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

export function middleName() {
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

export function lastName() {
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

export function prefix() {
  return _.sample(['Dr', '', '', '', '', '', '']); //Extra empty strings artificially raise the likelihood of the value being an empty string
}

export function suffix() {
  return _.sample(['Sr', 'Jr', 'III', 'IV', 'V', 'VI', '', '', '', '', '', '', '', '', '', '', '', '', '']);
}

export function street() {
  return `${_.random(1, 9999)} Test ${_.sample(['Rd', 'Ln', 'St', 'Ave', 'Ct'])}`;
}

export function apartment() {
  return _.sample([`Apt ${_.random(1, 200)}`, '', '']);
}

export function city() {
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

export function zipcode() {
  return _.random(1, 9999).toString().padStart(5, '0'); //Zipcodes starting with 0 are pretty uncommon
}

export function state(theFifty: boolean = true) {
  const territories: string[] = [
    'American Samoa',
    'Guam',
    'Northern Mariana Islands',
    'U.S. Virgin Islands',
    'Puerto Rico',
  ];

  const states: string[] = [
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

  if (theFifty) return _.sample(states);
  else return _.sample(states.concat(territories));
}

export function phone() {
  return `${_.random(1, 999).toString().padStart(3, '0')}${_.random(1000000, 1999999).toString()}`; //Area code from 001 to 999 || 7-digit number starting with between 100 to 199 because (supposedly) that range always corresponds to fake numbers
}

export function occupation() {
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

export function candidateOffice() {
  return _.sample(['House', 'Presidential', 'Senate']);
}

export function candidateID(candidateOffice: string) {
  return `${candidateOffice[0]}${_.random(1, 99999999).toString().padStart(8, '0')}`;
}

export function committeeID() {
  return `C${_.random(1, 99999999).toString().padStart(8, '0')}`;
}

export function groupName() {
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
