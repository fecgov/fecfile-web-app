import * as _ from 'lodash';
import * as generator from './generators.spec';


export type Contact = ContactIndividual | ContactCandidate | 
                      ContactCommittee  | ContactOrganization;

type ContactType = "Individual" | "Candidate" | "Committee" | "Organization"

export type ContactPrototype = {
  contact_type?: ContactType
  last_name?: string,
  first_name?: string,
  middle_name?: string,
  prefix?: string,
  suffix?: string,
  street?: string,
  apartment?: string,
  city?: string,
  zip?: string,
  state?: string,
  phone?: string,
  employer?: string,
  occupation?: string,
  candidate_id?: string,
  candidate_office?: string,
  candidate_state?: string,
  candidate_district?: string,
  committee_id?: string,
  committee_name?: string,
  organization_name?: string,
}

type NameFields = {
  last_name: string,
  first_name: string,
  middle_name: string,
  prefix: string,
  suffix: string,
}

type AddressFields = {
  street: string,
  apartment: string,
  city: string,
  state: string,
  zip: string,
  phone: string,
}

type OccupationFields = {
  employer: string,
  occupation: string,
}

type ContactIndividual = {
  contact_type: 'Individual',
  name: string,
} & NameFields & AddressFields & OccupationFields

type ContactCandidate = {
  contact_type: 'Candidate'
  name: string,
  candidate_id: string,
  candidate_office: string,
  candidate_state: string,
  candidate_district: string,
} & NameFields & AddressFields & OccupationFields

type ContactCommittee = {
  contact_type: 'Committee',
  name: string
  committee_id: string,
  committee_name: string,
} & AddressFields

type ContactOrganization = {
  contact_type: 'Organization',
  name: string,
  organization_name: string,
} & AddressFields


export function generateContactObject(contactGiven: ContactPrototype): Contact {
  const type = (
    contactGiven['contact_type'] ??
    _.sample(["Individual","Candidate","Committee","Organization"])
  ) as ContactType;

  switch(type) {
    case "Individual":
      return generateContactIndividual(contactGiven);
    case "Candidate":
      return generateContactCandidate(contactGiven);
    case "Committee":
      return generateContactCommittee(contactGiven);
    case "Organization":
      return generateContactOrganization(contactGiven);
  }
}

export function generateContactIndividual(contactGiven: ContactPrototype): ContactIndividual {
  const contact: ContactIndividual = {
    name: '',
    ...genNameFields(contactGiven),
    ...genAddressFields(contactGiven),
    ...genOccupationFields(contactGiven),
    contact_type: "Individual",
  }
  contact["name"] = `${contact["first_name"]} ${contact["last_name"]}`;
  return contact as ContactIndividual;
}

export function generateContactCandidate(contactGiven: ContactPrototype): ContactCandidate {
  const contact: ContactCandidate = {
    ...generateContactIndividual(contactGiven),
    candidate_id: '',
    candidate_office: contactGiven["candidate_office"] ?? generator.candidateOffice(),
    candidate_state: contactGiven["candidate_state"] ?? generator.state(),
    candidate_district: contactGiven["candidate_district"] ?? "01",
    contact_type: "Candidate",
  }
  contact['candidate_id'] = generator.candidateID(contact['candidate_office']);
  return contact;
}

export function generateContactCommittee(contactGiven: ContactPrototype): ContactCommittee {
  const contact: ContactCommittee = {
    ...genAddressFields(contactGiven),
    name: '',
    committee_name: contactGiven["committee_name"] ?? `Committee ${generator.groupName()}`,
    committee_id: contactGiven["committee_id"] ?? generator.committeeID(),
    contact_type: "Committee",
  }
  contact['name'] = contact['committee_name'];
  return contact;
}

export function generateContactOrganization(contactGiven: ContactPrototype): ContactOrganization {
  const contact: ContactOrganization = {
    name:'',
    ...genAddressFields(contactGiven),
    organization_name: contactGiven["organization_name"] ?? 
      `Organization ${generator.groupName()}`,
    contact_type: "Organization",
  }
  contact['name'] = contact["organization_name"];
  return contact;
}

function genNameFields(contactGiven: ContactPrototype): NameFields {
  const nameFields: NameFields = {
    first_name: contactGiven["first_name"] ?? generator.firstName(),
    last_name: contactGiven["last_name"] ?? generator.lastName(),
    middle_name: contactGiven["middle_name"] ?? generator.middleName(),
    prefix: contactGiven["prefix"] ?? generator.prefix(),
    suffix: contactGiven["suffix"] ?? generator.suffix(),
  }
  return nameFields;
}

function genAddressFields(contactGiven: ContactPrototype): AddressFields {
  const addressFields: AddressFields = {
    street: contactGiven["street"] ?? generator.street(),
    apartment: contactGiven["apartment"] ?? generator.apartment(),
    city: contactGiven["city"] ?? generator.city(),
    zip: contactGiven["zip"] ?? generator.zipcode(),
    phone: contactGiven["phone"] ?? generator.phone(),
    state: contactGiven["state"] ?? generator.state(),
  }
  return addressFields;
}

function genOccupationFields(contactGiven: ContactPrototype): OccupationFields {
  const occupationFields: OccupationFields = {
    employer: contactGiven["employer"] ?? generator.employer(),
    occupation: contactGiven["occupation"] ?? generator.occupation(),
  }
  return occupationFields;
}
