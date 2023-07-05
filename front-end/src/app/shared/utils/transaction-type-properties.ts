import { ContactTypes } from '../models/contact.model';
import { TemplateMapKeyType } from '../models/transaction-type.model';

/**
 * CONTACT TYPE OPTIONS
 */
export const INDIVIDUAL = [ContactTypes.INDIVIDUAL];
export const ORGANIZATION = [ContactTypes.ORGANIZATION];
export const COMMITTEE = [ContactTypes.COMMITTEE];
export const COMMITTEE_INDIVIDUAL = [ContactTypes.COMMITTEE, ContactTypes.INDIVIDUAL];
export const ORGANIZATION_INDIVIDUAL = [ContactTypes.ORGANIZATION, ContactTypes.INDIVIDUAL];
export const INDIVIDUAL_ORGANIZATION_COMMITTEE = [
  ContactTypes.INDIVIDUAL,
  ContactTypes.ORGANIZATION,
  ContactTypes.COMMITTEE,
];
export const ORGANIZATION_INDIVIDUAL_COMMITTEE = [
  ContactTypes.ORGANIZATION,
  ContactTypes.INDIVIDUAL,
  ContactTypes.COMMITTEE,
];

/**
 * FORM CONTROL PRESETS
 */

export const CORE_FIELDS: string[] = [
  'entity_type',
  'street_1',
  'street_2',
  'city',
  'state',
  'zip',
  'date',
  'amount',
  'aggregate',
  'purpose_description',
  'memo_code',
  'text4000',
  'category_code',
];

export const INDIVIDUAL_FIELDS: string[] = ['last_name', 'first_name', 'middle_name', 'prefix', 'suffix'];

export const ORG_FIELDS: string[] = ['organization_name'];

export const COM_FIELDS: string[] = ['organization_name', 'committee_fec_id', 'committee_name'];

export const EMPLOYEE_INFO_FIELDS: string[] = ['employer', 'occupation'];

export const CAN_FIELDS: string[] = [
  'candidate_fec_id',
  'candidate_last_name',
  'candidate_first_name',
  'candidate_middle_name',
  'candidate_prefix',
  'candidate_suffix',
  'candidate_office',
  'candidate_state',
  'candidate_district',
];

export const ELECTION_FIELDS: string[] = ['election_code', 'election_other_description'];

// GROUP A
export const IND_ONLY: string[] = [...CORE_FIELDS, ...INDIVIDUAL_FIELDS, ...EMPLOYEE_INFO_FIELDS];
// GROUP B
export const IND_ORG_COM_NO_EMP_OR_COM_INFO: string[] = [...CORE_FIELDS, ...INDIVIDUAL_FIELDS, ...ORG_FIELDS];
// GROUP C
export const IND_ORG_COM_ONLY: string[] = [
  ...CORE_FIELDS,
  ...INDIVIDUAL_FIELDS,
  ...EMPLOYEE_INFO_FIELDS,
  ...ORG_FIELDS,
];
// GROUP D
export const ORG_ONLY: string[] = [...CORE_FIELDS, ...ORG_FIELDS];
// GROUP E/F/I
export const COM_ONLY: string[] = [...CORE_FIELDS, ...COM_FIELDS];
// GROUP G
export const IND_ORG_COM: string[] = [...CORE_FIELDS, ...INDIVIDUAL_FIELDS, ...EMPLOYEE_INFO_FIELDS, ...COM_FIELDS];
// GROUP H
export const COM_WITH_CAN: string[] = [...CORE_FIELDS, ...COM_FIELDS, ...CAN_FIELDS];
// GROUP L
export const IND_ORG_WITH_CAN: string[] = [
  ...CORE_FIELDS,
  ...INDIVIDUAL_FIELDS,
  ...COM_FIELDS,
  ...CAN_FIELDS,
  ...ELECTION_FIELDS,
];
// GROUP M
export const COM_WITH_CAN_NO_AGG: string[] = [...COM_WITH_CAN, ...ELECTION_FIELDS].filter(
  (field) => 'aggregate' != field
);
// GROUP N
export const IND_NO_AGG: string[] = IND_ONLY.filter((field) => 'aggregate' != field);
// GROUP O
export const IND_ORG_COM_WITH_CAN_ELEC_NO_COM: string[] = [...IND_ORG_ONLY, ...CAN_FIELDS, ...ELECTION_FIELDS];
// GROUP P
export const COM_NO_AGG: string[] = COM_ONLY.filter((field) => 'aggregate' != field);
// GROUP R
export const ORG_WITH_CAN: string[] = [...ORG_ONLY, ...ELECTION_FIELDS].filter((field) => 'aggregate' != field);
// GROUP S
export const IND_ORG_COM_NO_COM: string[] = [...IND_ORG_ONLY, ...ELECTION_FIELDS];
);

export class TransactionTypeFormProperties {
  contactTypeOptions: ContactTypes[] = [];
  formControlNames: string[] = [];

  constructor(contactTypeOptions: ContactTypes[], formControlNames: string[]) {
    this.contactTypeOptions = contactTypeOptions;
    this.formControlNames = formControlNames;
  }
}

export const GROUP_A: TransactionTypeFormProperties = new TransactionTypeFormProperties(INDIVIDUAL, [
  ...CORE_FIELDS,
  ...INDIVIDUAL_FIELDS,
  ...EMPLOYEE_INFO_FIELDS,
]);
export const GROUP_B: TransactionTypeFormProperties = new TransactionTypeFormProperties(
  INDIVIDUAL_ORGANIZATION_COMMITTEE,
  [...CORE_FIELDS, ...INDIVIDUAL_FIELDS, ...ORG_FIELDS]
);
export const GROUP_C: TransactionTypeFormProperties = new TransactionTypeFormProperties(
  INDIVIDUAL_ORGANIZATION_COMMITTEE,
  [...CORE_FIELDS, ...INDIVIDUAL_FIELDS, ...ORG_FIELDS, ...EMPLOYEE_INFO_FIELDS]
);
export const GROUP_D: TransactionTypeFormProperties = new TransactionTypeFormProperties(ORGANIZATION, [
  ...CORE_FIELDS,
  ...ORG_FIELDS,
]);
export const GROUP_EFI: TransactionTypeFormProperties = new TransactionTypeFormProperties(COMMITTEE, [
  ...CORE_FIELDS,
  ...COM_FIELDS,
]);
export const GROUP_G: TransactionTypeFormProperties = new TransactionTypeFormProperties(
  INDIVIDUAL_ORGANIZATION_COMMITTEE,
  [...CORE_FIELDS, ...INDIVIDUAL_FIELDS, ...EMPLOYEE_INFO_FIELDS, ...COM_FIELDS]
);
export const GROUP_H: TransactionTypeFormProperties = new TransactionTypeFormProperties(COMMITTEE, [
  ...CORE_FIELDS,
  ...COM_FIELDS,
  ...CAN_FIELDS,
]);
export const GROUP_L: TransactionTypeFormProperties = new TransactionTypeFormProperties(ORGANIZATION_INDIVIDUAL, [
  ...CORE_FIELDS,
  ...INDIVIDUAL_FIELDS,
  ...COM_FIELDS,
  ...CAN_FIELDS,
  ...ELECTION_FIELDS,
]);
export const GROUP_M: TransactionTypeFormProperties = new TransactionTypeFormProperties(
  COMMITTEE,
  [...CORE_FIELDS, ...COM_FIELDS, ...CAN_FIELDS, ...ELECTION_FIELDS].filter((field) => 'aggregate' != field)
);
export const GROUP_N: TransactionTypeFormProperties = new TransactionTypeFormProperties(
  INDIVIDUAL,
  [...CORE_FIELDS, ...INDIVIDUAL_FIELDS, ...EMPLOYEE_INFO_FIELDS].filter((field) => 'aggregate' != field)
);
export const GROUP_O: TransactionTypeFormProperties = new TransactionTypeFormProperties(
  ORGANIZATION_INDIVIDUAL_COMMITTEE,
  [...CORE_FIELDS, ...INDIVIDUAL_FIELDS, ...ORG_FIELDS, ...EMPLOYEE_INFO_FIELDS, ...CAN_FIELDS, ...ELECTION_FIELDS]
);
export const GROUP_P: TransactionTypeFormProperties = new TransactionTypeFormProperties(
  COMMITTEE,
  [...CORE_FIELDS, ...COM_FIELDS].filter((field) => 'aggregate' != field)
);
export const GROUP_R: TransactionTypeFormProperties = new TransactionTypeFormProperties(
  ORGANIZATION,
  [...CORE_FIELDS, ...ORG_FIELDS, ...ELECTION_FIELDS].filter((field) => 'aggregate' != field)
);
export const GROUP_S: TransactionTypeFormProperties = new TransactionTypeFormProperties(
  INDIVIDUAL_ORGANIZATION_COMMITTEE,
  [...CORE_FIELDS, ...INDIVIDUAL_FIELDS, ...COM_FIELDS, ...ELECTION_FIELDS]
);
