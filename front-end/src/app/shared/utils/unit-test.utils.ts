import { selectUserLoginData } from 'app/store/login.selectors';
import { selectReportCodeLabelList } from 'app/store/label-lookup.selectors';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { selectCashOnHand } from 'app/store/cash-on-hand.selectors';
import { initialState as initUserLoginData } from 'app/store/login.reducer';
import { initialState as initReportCodeLabelList } from 'app/store/label-lookup.reducer';
import { initialState as initActiveReport } from 'app/store/active-report.reducer';
import { initialState as initCommitteeAccount } from 'app/store/committee-account.reducer';
import { initialState as initCashOnHand } from 'app/store/cash-on-hand.reducer';
import { UserLoginData } from '../models/user.model';
import { CommitteeAccount } from '../models/committee-account.model';
import { F3xSummary } from '../models/f3x-summary.model';
import { ReportCodeLabelList } from './reportCodeLabels.utils';
import { UploadSubmission } from '../models/upload-submission.model';
import { CashOnHand } from '../interfaces/report.interface';

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
  custodian_name_middle: null,
  custodian_name_prefix: null,
  custodian_name_suffix: null,
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
  fax: null,
  filing_frequency: 'A',
  first_f1_date: '2016-01-01',
  first_file_date: '2016-01-01',
  form_type: 'F1',
  last_f1_date: '2016-01-01',
  last_file_date: '2016-02-08',
  leadership_pac: null,
  lobbyist_registrant_pac: null,
  name: 'WORLD CAPITALIST PARADISE',
  organization_type: null,
  organization_type_full: null,
  party: null,
  party_full: null,
  party_type: null,
  party_type_full: null,
  sponsor_candidate_ids: null,
  state: 'FL',
  state_full: 'Florida',
  street_1: '1900 WEST OAKLAND PARK BLVD.',
  street_2: '# 9961',
  treasurer_city: 'FORT LAUDERDALE',
  treasurer_name: 'LAROSE, JOSH',
  treasurer_name_1: 'JOSH',
  treasurer_name_2: 'LAROSE',
  treasurer_name_middle: null,
  treasurer_name_prefix: null,
  treasurer_name_suffix: null,
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
  token: 'jwttokenstring',
};

export const testReportCodes: ReportCodeLabelList = [
  {
    report_code: 'Q1',
    label: 'Test Label',
  },
];

export const testActiveReport: F3xSummary = F3xSummary.fromJSON({
  id: 999,
  coverage_from_date: '2022-05-25',
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

export const testCashOnHand: CashOnHand = { report_id: 999, value: 100.0 };

export const testMockStore = {
  initialState: {
    fecfile_online_committeeAccount: initCommitteeAccount,
    fecfile_online_userLoginData: initUserLoginData,
    fecfile_online_reportCodeLabelList: initReportCodeLabelList,
    fecfile_online_activeReport: initActiveReport,
    fecfile_online_cashOnHand: initCashOnHand,
  },
  selectors: [
    { selector: selectCommitteeAccount, value: testCommitteeAccount },
    { selector: selectUserLoginData, value: testUserLoginData },
    { selector: selectReportCodeLabelList, value: testReportCodes },
    { selector: selectActiveReport, value: testActiveReport },
    { selector: selectCashOnHand, value: testCashOnHand },
  ],
};
