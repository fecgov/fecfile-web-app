import { LabelUtils } from 'app/shared/utils/label.utils';
import { ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from '../../scha-transaction.model';
import { AuthorizedCommitteeMemo } from './authorized-committee-memo.model';
import { Transaction } from '../../transaction.model';
import { JsonSchema } from 'fecfile-validate';
import { COMMITTEE, COMMITTEE_FORM_FIELDS, ELECTION_FIELDS } from 'app/shared/utils/transaction-type-properties';

export class PAC_AC_TRANSFER_MEMO extends AuthorizedCommitteeMemo {
  formFields = [...COMMITTEE_FORM_FIELDS, ...ELECTION_FIELDS];
  contactTypeOptions = COMMITTEE;
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.PAC_AC_TRANSFER_MEMO);
  schema = {} as JsonSchema;

  override getNewTransaction(): Transaction {
    throw new Error('Method not implemented.');
  }
}
