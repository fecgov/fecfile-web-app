import * as _ from 'lodash';

export function GenerateContactObject(ContactGiven: object = {}): object {
  let ContactRandom: object = {
    //fields defined in this object are intentionally not CamelCase as they are intended to mirror the FormControlNames of elements on the Front-End
    //_.sample : standard js object method (hence _.); takes a random element from a given list.  Much more readable than [randomint % list.length] on every list
    contact_type: _.sample(['Individual', 'Candidate', 'Committee', 'Organization']),

    // Fields needed for an Individual
    //Names were provided by a random name generator
    last_name: _.sample([
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
    ]),
    first_name: _.sample([
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
    ]),
    middle_name: _.sample([
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
    ]),
    prefix: _.sample(['Dr', '', '', '', '', '', '']), //Extra empty strings artificially raise the likelihood of the value being an empty string
    suffix: _.sample(['Sr', 'Jr', 'III', 'IV', 'V', 'VI', '', '', '', '', '', '', '', '', '', '', '', '', '']),
    street: `${_.random(1, 9999)} Test ${_.sample(['Rd', 'Ln', 'St', 'Ave', 'Ct'])}`,
    apartment: _.sample([`Apt ${_.random(1, 200)}`, '', '']),
    city: _.sample([
      'Testopolis',
      'Testville',
      'Testburg',
      'Testland',
      'Testford',
      'Testham',
      'Testmouth',
      'Testborough',
      'Testbury',
    ]),
    zip: _.random(1, 9999).toString().padStart(5, '0'), //Zipcodes starting with 0 are pretty uncommon
    // prettier-ignore
    state: _.sample([ // prettier-ignore
      'Alabama','Alaska','American Samoa','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Florida','Georgia','Guam','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Northern Mariana Islands','Ohio','Oklahoma','Oregon','Pennsylvania','Puerto Rico','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','U.S. Virgin Islands','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming',
    ]),
    phone: `${_.random(1, 999).toString().padStart(3, '0')}${_.random(1000000, 1999999).toString()}`, //Area code from 001 to 999 || 7-digit number starting with between 100 to 199 because (supposedly) that range always corresponds to fake numbers
    employer: '',
    //Jobs provided by another random generator
    occupation: _.sample([
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
    ]),

    //Candidate-exclusive fields
    candidate_id: `C${_.random(1, 99999999).toString().padStart(8, '0')}`,
    candidate_office: _.sample(['House', 'Presidential', 'Senate']),
    candidate_state: _.sample([
      'Alabama',
      'Alaska',
      'Arizona',
      'Arkansas',
      'California',
      'Colorado',
      'Connecticut',
      'Delaware',
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
    ]),
    candidate_district: '01',

    //Committee-exclusive fields
    committee_id: `C${_.random(1, 99999999).toString().padStart(8, '0')}`,
    committee_name: `${_.sample(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'])} for American ${_.sample([
      'Happiness',
      'Exceptionalism',
      'Integrity',
      'Unity',
      'Prosperity',
    ])}`,

    //Organization-exclusive fields
    organization_name: `${_.sample(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'])} for American ${_.sample([
      'Happiness',
      'Exceptionalism',
      'Integrity',
      'Unity',
      'Prosperity',
    ])}`,

    //Name that will show up on the "Manage Contacts" table
    name: '',
  };

  let Contact = { ...ContactRandom, ...ContactGiven }; //Merges the provided contact with the randomly generated one, overwriting the random one with any fields found in the provided

  //  Resolve the contact object's "name" based on contact_type.  This must be done after merging in case the ContactGiven object does not provide first, last, committee, or organization names
  if (Contact['contact_type'] == 'Individual' || Contact['contact_type'] == 'Candidate') {
    Contact['name'] = `${Contact['first_name']} ${Contact['last_name']}`;
  }
  if (Contact['contact_type'] == 'Committee') {
    Contact['name'] = Contact['committee_name'];
  }
  if (Contact['contact_type'] == 'Organization') {
    Contact['name'] = Contact['organization_name'];
  }

  return Contact;
}

export function EnterContact(Contact: object, Save: boolean = true) {
  cy.get('.p-menubar').find('.p-menuitem-link').contains('Contacts').click();
  cy.wait(100);

  cy.get('#button-contacts-new').click();
  cy.wait(100);

  cy.DropdownSetValue("p-dropdown[formcontrolname='type']", Contact['contact_type']);

  if (Contact['contact_type'] == 'Individual' || Contact['contact_type'] == 'Candidate') {
    //Contact
    cy.get('#last_name').SafeType(Contact['last_name']);
    cy.get('#first_name').SafeType(Contact['first_name']);
    cy.get('#middle_name').SafeType(Contact['middle_name']);
    cy.get('#prefix').SafeType(Contact['prefix']);
    cy.get('#suffix').SafeType(Contact['suffix']);

    //Employer
    cy.get('#employer').SafeType(Contact['employer']);
    cy.get('#occupation').SafeType(Contact['occupation']);
  }

  //Address
  cy.get('#street_1').SafeType(Contact['street']);
  cy.get('#street_2').SafeType(Contact['apartment']);
  cy.get('#city').SafeType(Contact['city']);
  cy.get('#zip').SafeType(Contact['zip']);
  cy.get('#telephone').SafeType(Contact['phone']);
  cy.DropdownSetValue("p-dropdown[formcontrolname='state']", Contact['state']);

  //Candidate-exclusive fields
  if (Contact['contact_type'] == 'Candidate') {
    cy.get('#candidate_id').SafeType(Contact['candidate_id']);

    cy.DropdownSetValue("p-dropdown[formcontrolname='candidate_office']", Contact['candidate_office']);

    if (Contact['candidate_office'] != 'Presidential') {
      cy.DropdownSetValue("p-dropdown[formcontrolname='candidate_state']", Contact['candidate_state']);

      if (Contact['candidate_office'] == 'House') {
        cy.DropdownSetValue("p-dropdown[formcontrolname='candidate_district']", Contact['candidate_district']);
      }
    }
  }

  if (Contact['contact_type'] == 'Committee') {
    cy.get('#committee_id').SafeType(Contact['committee_id']);
    cy.get('#name').SafeType(Contact['committee_name']);
  }

  if (Contact['contact_type'] == 'Organization') {
    cy.get('#name').SafeType(Contact['organization_name']);
  }

  if (Save) {
    cy.get('.p-button-primary > .p-button-label').contains('Save').click();
  }

  cy.wait(250); //Gives the database time to process the request.  It gets a little funky otherwise...
}
