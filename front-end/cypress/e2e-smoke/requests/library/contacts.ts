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

function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 10000;
  }
  return hash || 1;
}

function splitTrailingDigits(value: string): { prefix: string; digits: string } | null {
  let splitIndex = value.length;

  while (splitIndex > 0) {
    const code = value.charCodeAt(splitIndex - 1);
    const isDigit = code >= 48 && code <= 57;
    if (!isDigit) {
      break;
    }
    splitIndex -= 1;
  }

  if (splitIndex === value.length) {
    return null;
  }

  return {
    prefix: value.slice(0, splitIndex),
    digits: value.slice(splitIndex),
  };
}

function addOffsetToTrailingDigits(value: string, offset: number): string {
  const parts = splitTrailingDigits(value);
  if (!parts) return value;

  const { prefix, digits } = parts;
  const modulus = 10 ** digits.length;
  const next = (Number.parseInt(digits, 10) + offset) % modulus;
  return `${prefix}${next.toString().padStart(digits.length, '0')}`;
}

export function withUniqueContactIdentifiers(contact: MockContact, seed: string): MockContact {
  if (!seed) return { ...contact };

  const offset = hashSeed(seed);
  const updated: MockContact = { ...contact };

  if (updated.candidate_id) {
    updated.candidate_id = addOffsetToTrailingDigits(updated.candidate_id, offset);
  }

  if (updated.committee_id) {
    updated.committee_id = addOffsetToTrailingDigits(updated.committee_id, offset);
  }

  return updated;
}
