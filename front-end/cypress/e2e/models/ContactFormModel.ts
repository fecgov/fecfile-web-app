import { faker } from '@faker-js/faker';

export class ContactFormData {
  contact_type: string;
  last_name: string;
  first_name: string;
  middle_name: string;
  prefix: string;
  suffix: string;
  country: string;
  street_1: string;
  street_2: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  employer: string;
  occupation: string;
  candidate_id: string;
  candidate_office: string;
  candidate_state: string;
  candidate_district: string;
  committee_id: string;
  name: string;

  constructor(formData: ContactFormData) {
    this.contact_type = formData.contact_type;
    this.last_name = formData.last_name;
    this.first_name = formData.first_name;
    this.middle_name = formData.middle_name;
    this.prefix = formData.prefix;
    this.suffix = formData.suffix;
    this.country = formData.country;
    this.street_1 = formData.street_1;
    this.street_2 = formData.street_2;
    this.city = formData.city;
    this.state = formData.state;
    this.zip = formData.zip;
    this.phone = formData.phone;
    this.employer = formData.employer;
    this.occupation = formData.occupation;
    this.name = formData.name;
    this.committee_id = formData.committee_id;
    this.candidate_district = formData.candidate_district;
    this.candidate_id = formData.candidate_id;
    this.candidate_office = formData.candidate_office;
    this.candidate_state = formData.candidate_state;
  }
}

export enum ContactType {
  INDIVIDUAL = 'Individual',
  COMMITTEE = 'Committee',
  ORGANIZATION = 'Organization',
  CANDIDATE = 'Candidate',
}

export const defaultFormData: ContactFormData = createContact(ContactType.INDIVIDUAL);

export const organizationFormData: ContactFormData = createContact(ContactType.ORGANIZATION);

export const candidateFormData: ContactFormData = createContact(ContactType.CANDIDATE);

export const committeeFormData: ContactFormData = createContact(ContactType.COMMITTEE);

export function createContact(contact_type: ContactType): ContactFormData {
  const office = faker.helpers.arrayElement(['House', 'Presidential', 'Senate']);
  let candidateId = `P${faker.string.numeric(8)}`;
  if (office == 'House')
    candidateId = `H${faker.string.numeric(1)}${faker.location.state({ abbreviated: true })}${faker.string.numeric(5)}`;
  if (office == 'Senate')
    candidateId = `S${faker.string.numeric(1)}${faker.location.state({ abbreviated: true })}${faker.string.numeric(5)}`;
  return {
    contact_type,
    last_name: faker.person.lastName(),
    first_name: faker.person.firstName(),
    middle_name: faker.person.middleName(),
    prefix: faker.person.prefix(),
    suffix: faker.person.suffix(),
    country: 'United States of America',
    street_1: faker.location.streetAddress(),
    street_2: faker.location.secondaryAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    zip: faker.location.zipCode('#####'),
    phone: faker.string.numeric(10),
    employer: faker.company.name(),
    occupation: faker.person.jobTitle(),
    candidate_id: candidateId,
    candidate_office: office,
    candidate_state: faker.location.state(),
    candidate_district: '01', //because the options are based on state, just pick 01
    committee_id: `C${faker.string.numeric(8)}`,
    name: faker.company.name(),
  };
}
