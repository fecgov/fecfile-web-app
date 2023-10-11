import { initialState as initActiveReport } from 'app/store/active-report.reducer';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { initialState as initCashOnHand } from 'app/store/cash-on-hand.reducer';
import { selectCashOnHand } from 'app/store/cash-on-hand.selectors';
import { initialState as initCommitteeAccount } from 'app/store/committee-account.reducer';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { initialState as initUserLoginData } from 'app/store/login.reducer';
import { selectUserLoginData } from 'app/store/login.selectors';
import { CashOnHand } from '../interfaces/report.interface';
import { CommitteeAccount } from '../models/committee-account.model';
import { CandidateOfficeTypes, Contact, ContactTypes } from '../models/contact.model';
import { F3xSummary } from '../models/f3x-summary.model';
import { MemoText } from '../models/memo-text.model';
import { SchATransaction, ScheduleATransactionTypes } from '../models/scha-transaction.model';
import { SchBTransaction, ScheduleBTransactionTypes } from '../models/schb-transaction.model';
import { TransactionTemplateMapType } from '../models/transaction-type.model';
import { AggregationGroups, Transaction, TransactionTypes } from '../models/transaction.model';
import { UploadSubmission } from '../models/upload-submission.model';
import { UserLoginData } from '../models/user.model';
import { TransactionTypeUtils } from './transaction-type.utils';

export const testCommitteeAccount: CommitteeAccount = CommitteeAccount.fromJSON({
  affiliated_committee_name: 'NONE',
  candidate_ids: [],
  city: 'FORT LAUDERDALE',
  committee_id: 'C00601211',
  committee_type: 'O',
  committee_type_full: 'Super PAC (Independent Expenditure-Only)',
  custodian_city: 'FORT LAUDERDALE',
  custodian_name_1: 'JOSH',
  custodian_name_2: 'LAROSE',
  custodian_name_full: 'LAROSE, JOSH',
  custodian_name_middle: undefined,
  custodian_name_prefix: undefined,
  custodian_name_suffix: undefined,
  custodian_name_title: 'PRESIDENT',
  custodian_phone: '8007686650',
  custodian_state: 'FL',
  custodian_street_1: '1900 WEST OAKLAND PARK BLVD.',
  custodian_street_2: '# 9961',
  custodian_zip: '33310',
  cycles: [2016],
  designation: 'U',
  designation_full: 'Unauthorized',
  email: 'USPOLITICALACTIONCOMMITTEES@GMAIL.COM',
  fax: undefined,
  filing_frequency: 'A',
  first_f1_date: '2016-01-01',
  first_file_date: '2016-01-01',
  form_type: 'F1',
  last_f1_date: '2016-01-01',
  last_file_date: '2016-02-08',
  leadership_pac: undefined,
  lobbyist_registrant_pac: undefined,
  name: 'WORLD CAPITALIST PARADISE',
  organization_type: undefined,
  organization_type_full: undefined,
  party: undefined,
  party_full: undefined,
  party_type: undefined,
  party_type_full: undefined,
  sponsor_candidate_ids: undefined,
  state: 'FL',
  state_full: 'Florida',
  street_1: '1900 WEST OAKLAND PARK BLVD.',
  street_2: '# 9961',
  treasurer_city: 'FORT LAUDERDALE',
  treasurer_name: 'LAROSE, JOSH',
  treasurer_name_1: 'JOSH',
  treasurer_name_2: 'LAROSE',
  treasurer_name_middle: undefined,
  treasurer_name_prefix: undefined,
  treasurer_name_suffix: undefined,
  treasurer_name_title: 'TREASURER',
  treasurer_phone: '8007686650',
  treasurer_state: 'FL',
  treasurer_street_1: '1900 WEST OAKLAND PARK BLVD.',
  treasurer_street_2: '# 9961',
  treasurer_zip: '33310',
  website: 'WWW.UNITEDSTATESPOLITICALACTIONCOMMITTEESDIRECTORY.COM',
  zip: '33310',
});

export const testUserLoginData: UserLoginData = {
  committee_id: 'C00000000',
  email: 'email@fec.com',
  is_allowed: true,
  login_dot_gov: false,
};

export const testActiveReport: F3xSummary = F3xSummary.fromJSON({
  id: '999',
  coverage_from_date: '2022-05-25',
  coverage_through_date: '2022-06-30',
  form_type: 'F3XN',
  report_code: 'Q1',
  upload_submission: UploadSubmission.fromJSON({}),
  webprint_submission: {
    fec_email: 'test@test.com',
    fec_batch_id: '1234',
    fec_image_url: 'image.test.com',
    fec_submission_id: 'FEC-1234567',
    fec_message: 'Message Goes Here',
    fec_status: 'COMPLETED',
    fecfile_error: '',
    fecfile_task_state: 'COMPLETED',
    id: 0,
    created: '10/10/2010',
    updated: '10/12/2010',
  },
});

export const testCashOnHand: CashOnHand = { report_id: '999', value: 100.0 };

export const testMockStore = {
  initialState: {
    fecfile_online_committeeAccount: initCommitteeAccount,
    fecfile_online_userLoginData: initUserLoginData,
    fecfile_online_activeReport: initActiveReport,
    fecfile_online_cashOnHand: initCashOnHand,
  },
  selectors: [
    { selector: selectCommitteeAccount, value: testCommitteeAccount },
    { selector: selectUserLoginData, value: testUserLoginData },
    { selector: selectActiveReport, value: testActiveReport },
    { selector: selectCashOnHand, value: testCashOnHand },
  ],
};

export const testContact = Contact.fromJSON({
  id: '111',
  type: ContactTypes.INDIVIDUAL,
  candidate_id: '999',
  committee_id: '888',
  name: 'Organization LLC',
  last_name: 'Smith',
  first_name: 'Joe',
  middle_name: 'James',
  prefix: 'Mr',
  suffix: 'Jr',
  street_1: '123 Main St',
  street_2: 'Apt B',
  city: 'Anytown',
  state: 'VA',
  zip: '22201',
  employer: 'Plumbing, Inc.',
  occupation: 'plumber',
  candidate_office: CandidateOfficeTypes.HOUSE,
  candidate_state: 'VA',
  candidate_district: '1',
  telephone: '555-555-5555',
  country: 'USA',
  created: '8/27/2023',
  updated: null,
  deleted: null,
  transaction_count: 3,
});

export const testIndividualReceipt: SchATransaction = SchATransaction.fromJSON({
  id: '123',
  transaction_type_identifier: ScheduleATransactionTypes.INDIVIDUAL_RECEIPT,
  report_id: '999',
  contribution_amount: '202.2',
  contribution_date: '2022-02-02',
  entity_type: ContactTypes.INDIVIDUAL,
  contributor_organization_name: 'org name',
  contributor_street_1: '123 Main St',
  contributor_city: 'city',
  contributor_state: 'VA',
  contributor_zip: '20001',
  contributor_employer: 'employer',
  contributor_occupation: 'occupation',
  memo_text: MemoText.fromJSON({ text4000: 'Memo!' }),
  contact_1_id: '456',
  contact_1: Contact.fromJSON({
    id: 'testId',
    type: ContactTypes.INDIVIDUAL,
    last_name: 'testLn1',
    first_name: 'testFn1',
    middle_name: 'testMn1',
    prefix: 'testPrefix1',
    suffix: 'testSuffix1',
    employer: 'testEmployer1',
    occupation: 'testOccupation1',
    street_1: 'testStreet1',
    street_2: 'testStreet2',
    city: 'testCity1',
    state: 'VA',
    zip: '12345',
  }),
});

export const testScheduleATransaction = SchATransaction.fromJSON({
  form_type: 'SA15',
  transaction_type_identifier: ScheduleATransactionTypes.OFFSET_TO_OPERATING_EXPENDITURES,
  transaction_id: 'AAAAAAAAAAAAAAAAAAA',
  entity_type: ContactTypes.COMMITTEE,
  contributor_organization_name: 'org name',
  contributor_street_1: '123 Main St',
  contributor_city: 'city',
  contributor_state: 'VA',
  contributor_zip: '20001',
  contribution_date: '2022-08-11',
  contribution_amount: 1,
  contribution_aggregate: 2,
  contribution_purpose_descrip: 'Joint Fundraising Memo: test',
  aggregation_group: AggregationGroups.GENERAL,
  memo_code: true,
  donor_committee_fec_id: 'C00000000',
});

export const testScheduleBTransaction = SchBTransaction.fromJSON({
  form_type: 'SB21b',
  transaction_type_identifier: ScheduleBTransactionTypes.OPERATING_EXPENDITURE,
  transaction_id: 'AAAAAAAAAAAAAAAAAAA',
  entity_type: ContactTypes.ORGANIZATION,
  contributor_organization_name: 'org name',
  contributor_street_1: '123 Main St',
  contributor_city: 'city',
  contributor_state: 'VA',
  contributor_zip: '20001',
  contribution_date: '2022-08-11',
  contribution_amount: 1,
  contribution_aggregate: 2,
  aggregation_group: AggregationGroups.GENERAL_DISBURSEMENT,
});

export function getTestTransactionByType(
  transactionType: TransactionTypes,
  parentTransactionType?: TransactionTypes
): Transaction {
  const transaction = TransactionTypeUtils.factory(transactionType).getNewTransaction();
  if (parentTransactionType) {
    transaction.parent_transaction = TransactionTypeUtils.factory(parentTransactionType).getNewTransaction();
  }
  return transaction;
}

export const testTemplateMap: TransactionTemplateMapType = {
  last_name: 'contributor_last_name',
  first_name: 'contributor_first_name',
  middle_name: 'contributor_middle_name',
  prefix: 'contributor_prefix',
  suffix: 'contributor_suffix',
  street_1: 'contributor_street_1',
  street_2: 'contributor_street_2',
  city: 'contributor_city',
  state: 'contributor_state',
  zip: 'contributor_zip',
  employer: 'contributor_employer',
  occupation: 'contributor_occupation',
  organization_name: 'contributor_organization_name',
  committee_fec_id: 'donor_committee_fec_id',
  committee_name: 'donor_committee_name',
  candidate_fec_id: 'donor_candidate_fec_id',
  candidate_last_name: 'donor_candidate_last_name',
  candidate_first_name: 'donor_candidate_first_name',
  candidate_middle_name: 'donor_candidate_middle_name',
  candidate_prefix: 'donor_candidate_prefix',
  candidate_suffix: 'donor_candidate_suffix',
  candidate_office: 'donor_candidate_office',
  candidate_state: 'donor_candidate_state',
  candidate_district: 'donor_candidate_district',
  date: 'contribution_date',
  date2: '',
  memo_code: 'memo_code',
  amount: 'contribution_amount',
  balance: 'loan_balance',
  aggregate: 'contribution_aggregate',
  purpose_description: 'contribution_purpose_descrip',
  text4000: 'text4000',
  category_code: '',
  election_code: 'election_code',
  election_other_description: 'election_other_description',
  payment_to_date: '',
  due_date: '',
  due_date_setting: '',
  secured: '',
  interest_rate: '',
  interest_rate_setting: '',
  secondary_name: 'ind_name_account_location',
  secondary_street_1: 'account_street_1',
  secondary_street_2: 'account_street_2',
  secondary_city: 'account_city',
  secondary_state: 'account_state',
  secondary_zip: 'account_zip',
  signatory_1_last_name: 'treasurer_last_name',
  signatory_1_first_name: 'treasurer_first_name',
  signatory_1_middle_name: 'treasurer_middle_name',
  signatory_1_prefix: 'treasurer_prefix',
  signatory_1_suffix: 'treasurer_suffix',
  signatory_1_date: 'treasurer_date_signed',
  signatory_2_last_name: 'authorized_last_name',
  signatory_2_first_name: 'authorized_first_name',
  signatory_2_middle_name: 'authorized_middle_name',
  signatory_2_prefix: 'authorized_prefix',
  signatory_2_suffix: 'authorized_suffix',
  signatory_2_title: 'authorized_title',
  signatory_2_date: 'authorized_date_signed',
};
