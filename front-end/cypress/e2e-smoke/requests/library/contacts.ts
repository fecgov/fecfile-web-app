enum ContactTypes {
  CANDIDATE = 'CAN',
  COMMITTEE = 'COM',
  INDIVIDUAL = 'IND',
  ORGANIZATION = 'ORG',
}

const address_fields = {
  street_1: '1234 Test Ln',
  street_2: null,
  city: 'Testville',
  state: 'AK',
  zip: '12345',
  country: 'USA',
  telephone: null,
};

const eo_fields = {
  employer: 'E',
  occupation: 'O',
};

const name_optionals = {
  middle_name: null,
  prefix: null,
  suffix: null,
};

export const Individual_A_A: MockContact = {
  type: ContactTypes.INDIVIDUAL,
  last_name: 'Ant',
  first_name: 'Accidental',
  ...name_optionals,
  ...address_fields,
  ...eo_fields,
};

export const Individual_B_B: MockContact = {
  type: ContactTypes.INDIVIDUAL,
  last_name: 'Bat',
  first_name: 'Bouncy',
  ...name_optionals,
  ...address_fields,
  ...eo_fields,
};

const Individual_C_C: MockContact = {
  type: ContactTypes.INDIVIDUAL,
  last_name: 'Cat',
  first_name: 'Careful',
  ...name_optionals,
  ...address_fields,
  ...eo_fields,
};

const Individual_D_D: MockContact = {
  type: ContactTypes.INDIVIDUAL,
  last_name: 'Dog',
  first_name: 'Diggory',
  ...name_optionals,
  ...address_fields,
  ...eo_fields,
};

export const Candidate_Presidential_A: MockContact = {
  type: ContactTypes.CANDIDATE,
  candidate_id: 'P00000001',
  candidate_office: 'P',
  candidate_state: null,
  candidate_district: null,
  first_name: 'Apple',
  last_name: 'President',
  ...address_fields,
  ...name_optionals,
  ...eo_fields,
};

export const Candidate_Presidential_B: MockContact = {
  type: ContactTypes.CANDIDATE,
  candidate_id: 'P00000002',
  candidate_office: 'P',
  candidate_state: null,
  candidate_district: null,
  first_name: 'Bat',
  last_name: 'President',
  ...address_fields,
  ...name_optionals,
  ...eo_fields,
};

export const Candidate_Senate_A: MockContact = {
  type: ContactTypes.CANDIDATE,
  candidate_id: 'S1AK00001',
  candidate_office: 'S',
  candidate_state: 'AK',
  candidate_district: null,
  first_name: 'Alpha',
  last_name: 'Senate',
  ...address_fields,
  ...name_optionals,
  ...eo_fields,
};

const Candidate_Senate_B: MockContact = {
  type: ContactTypes.CANDIDATE,
  candidate_id: 'S1AK00002',
  candidate_office: 'S',
  candidate_state: 'AK',
  candidate_district: null,
  first_name: 'Beta',
  last_name: 'Senate',
  ...address_fields,
  ...name_optionals,
  ...eo_fields,
};

export const Candidate_House_A: MockContact = {
  type: ContactTypes.CANDIDATE,
  candidate_id: 'H1AK00001',
  candidate_office: 'H',
  candidate_state: 'AK',
  candidate_district: '00',
  first_name: 'Aleph',
  last_name: 'House',
  ...address_fields,
  ...name_optionals,
  ...eo_fields,
};

export const Candidate_House_B: MockContact = {
  type: ContactTypes.CANDIDATE,
  candidate_id: 'H1AK00002',
  candidate_office: 'H',
  candidate_state: 'AK',
  candidate_district: '00',
  first_name: 'Beth',
  last_name: 'House',
  ...address_fields,
  ...name_optionals,
  ...eo_fields,
};

export const Committee_A: MockContact = {
  type: ContactTypes.COMMITTEE,
  committee_id: 'C00000001',
  name: 'Committee A',
  ...address_fields,
};

const Committee_B: MockContact = {
  type: ContactTypes.COMMITTEE,
  committee_id: 'C00000002',
  name: 'Committee B',
  ...address_fields,
};

export const Organization_A: MockContact = {
  type: ContactTypes.ORGANIZATION,
  name: 'Organization A',
  ...address_fields,
};

const Organization_B: MockContact = {
  type: ContactTypes.ORGANIZATION,
  name: 'Organization B',
  ...address_fields,
};

export interface MockContact {
  type: ContactTypes;
  committee_id?: string;
  name?: string;
  last_name?: string;
  first_name?: string;
  middle_name?: string | null;
  prefix?: string | null;
  suffix?: string | null;
  candidate_id?: string;
  candidate_office?: string;
  candidate_state?: string | null;
  candidate_district?: string | null;
  street_1: string;
  street_2: string | null;
  city: string;
  state: string;
  zip: string;
  country: string;
  telephone: string | null;
}

const SETUP_CONTACT_ID_SEED = Date.now();
let setupContactIdCounter = 0;

function nextSetupDigits(length: number) {
  setupContactIdCounter += 1;
  const max = 10 ** length;
  const value = (SETUP_CONTACT_ID_SEED + setupContactIdCounter) % max;
  return String(value).padStart(length, '0');
}

function uniqueCandidateId(candidateId: string) {
  if (/^[HS]\d[A-Z]{2}\d{5}$/.test(candidateId)) {
    return `${candidateId.slice(0, 4)}${nextSetupDigits(5)}`;
  }

  if (/^P\d{8}$/.test(candidateId)) {
    return `P${nextSetupDigits(8)}`;
  }

  return candidateId;
}

function uniqueCommitteeId(committeeId: string) {
  if (/^C\d{8}$/.test(committeeId)) {
    return `C${nextSetupDigits(8)}`;
  }

  return committeeId;
}

// Clone seeded setup contacts so backend-unique FEC ids do not collide across runs.
export function cloneSetupContact(contact: MockContact): MockContact {
  return {
    ...contact,
    candidate_id: contact.candidate_id ? uniqueCandidateId(contact.candidate_id) : contact.candidate_id,
    committee_id: contact.committee_id ? uniqueCommitteeId(contact.committee_id) : contact.committee_id,
  };
}