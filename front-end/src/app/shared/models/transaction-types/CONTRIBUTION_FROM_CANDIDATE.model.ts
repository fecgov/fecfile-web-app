import { LabelUtils } from 'app/shared/utils/label.utils';
import {
  ADDRESS_FIELDS,
  AGGREGATE,
  CANDIDATE_FIELDS,
  CANDIDATE_OFFICE_FIELDS,
  COMMON_FIELDS,
  ELECTION_FIELDS,
  EMPLOYEE_INFO_FIELDS,
} from 'app/shared/utils/transaction-type-properties';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/CONTRIBUTION_FROM_CANDIDATE';
import { ReportTypes } from '../reports/report.model';
import { SchATransactionType } from '../scha-transaction-type.model';
import { SchATransaction, ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from '../scha-transaction.model';
import { AggregationGroups } from '../transaction.model';
import { ContactTypes } from '../contact.model';

export class CONTRIBUTION_FROM_CANDIDATE extends SchATransactionType {
  formFields = [
    ...COMMON_FIELDS,
    ...ADDRESS_FIELDS,
    ...AGGREGATE,
    ...CANDIDATE_FIELDS,
    ...CANDIDATE_OFFICE_FIELDS,
    ...ELECTION_FIELDS,
    ...EMPLOYEE_INFO_FIELDS,
  ];
  contactTypeOptions = [ContactTypes.CANDIDATE];
  override contactConfig = {
    contact_1: {
      candidate_fec_id: 'candidate_id',
      candidate_last_name: 'last_name',
      candidate_first_name: 'first_name',
      candidate_middle_name: 'middle_name',
      candidate_prefix: 'prefix',
      candidate_suffix: 'suffix',
      candidate_office: 'candidate_office',
      candidate_state: 'candidate_state',
      candidate_district: 'candidate_district',
      employer: 'employer',
      occupation: 'occupation',
      street_1: 'street_1',
      street_2: 'street_2',
      city: 'city',
      state: 'state',
      zip: 'zip',
    },
  };
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.CONTRIBUTION_FROM_CANDIDATE);
  schema = schema;

  override hasElectionInformation(reportType: ReportTypes): boolean {
    return reportType === ReportTypes.F3;
  }

  override get isReattributable(): boolean {
    return false;
  }

  override isCloneableTransactionType = true;

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA11D',
      transaction_type_identifier: ScheduleATransactionTypes.CONTRIBUTION_FROM_CANDIDATE,
      aggregation_group: AggregationGroups.GENERAL,
    });
  }
}
