import { LabelUtils } from 'app/shared/utils/label.utils';
import {
  SchATransaction,
  ScheduleATransactionTypeLabels,
  ScheduleATransactionTypes,
} from '../../scha-transaction.model';
import { AuthorizedCommitteeMemo } from './authorized-committee-memo.model';
import { AggregationGroups } from '../../transaction.model';
import { ORGANIZATION_FORM_FIELDS, ELECTION_FIELDS, ORGANIZATION } from 'app/shared/utils/transaction-type-properties';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/TRIBAL_AC_TRANSFER_MEMO';

export class TRIBAL_AC_TRANSFER_MEMO extends AuthorizedCommitteeMemo {
  formFields = [...ORGANIZATION_FORM_FIELDS, ...ELECTION_FIELDS];
  contactTypeOptions = ORGANIZATION;
  schema = schema;
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.TRIBAL_AC_TRANSFER_MEMO);

  getNewTransaction() {
    return SchATransaction.fromJSON({
      transaction_type_identifier: ScheduleATransactionTypes.TRIBAL_AC_TRANSFER_MEMO,
      aggregation_group: AggregationGroups.GENERAL,
      memo_code: true,
    });
  }
}
