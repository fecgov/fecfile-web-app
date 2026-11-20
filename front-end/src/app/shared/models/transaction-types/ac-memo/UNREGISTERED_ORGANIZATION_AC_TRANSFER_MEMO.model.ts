import { LabelUtils } from 'app/shared/utils/label.utils';
import {
  SchATransaction,
  ScheduleATransactionTypeLabels,
  ScheduleATransactionTypes,
} from '../../scha-transaction.model';
import { AuthorizedCommitteeMemo } from './authorized-committee-memo.model';
import { ELECTION_FIELDS, ORGANIZATION, ORGANIZATION_FORM_FIELDS } from 'app/shared/utils/transaction-type-properties';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/UNREGISTERED_ORGANIZATION_AC_TRANSFER_MEMO';
import { AggregationGroups } from '../../transaction.model';

export class UNREGISTERED_ORGANIZATION_AC_TRANSFER_MEMO extends AuthorizedCommitteeMemo {
  formFields = [...ORGANIZATION_FORM_FIELDS, ...ELECTION_FIELDS];
  contactTypeOptions = ORGANIZATION;
  override schema = schema;
  title = LabelUtils.get(
    ScheduleATransactionTypeLabels,
    ScheduleATransactionTypes.UNREGISTERED_ORGANIZATION_AC_TRANSFER_MEMO,
  );

  getNewTransaction() {
    return SchATransaction.fromJSON({
      transaction_type_identifier: ScheduleATransactionTypes.UNREGISTERED_ORGANIZATION_AC_TRANSFER_MEMO,
      aggregation_group: AggregationGroups.GENERAL,
      memo_code: true,
    });
  }
}
