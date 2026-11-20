import { LabelUtils } from 'app/shared/utils/label.utils';
import { ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from '../../scha-transaction.model';
import { AuthorizedCommitteeMemo } from './authorized-committee-memo.model';
import { Transaction } from '../../transaction.model';
import { JsonSchema } from 'fecfile-validate';
import { ORGANIZATION_FORM_FIELDS, ELECTION_FIELDS, ORGANIZATION } from 'app/shared/utils/transaction-type-properties';

export class PARTNERSHIP_AC_TRANSFER_MEMO extends AuthorizedCommitteeMemo {
  formFields = [...ORGANIZATION_FORM_FIELDS, ...ELECTION_FIELDS];
  contactTypeOptions = ORGANIZATION;
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.PARTNERSHIP_AC_TRANSFER_MEMO);
  schema = {} as JsonSchema;

  override getNewTransaction(): Transaction {
    throw new Error('Method not implemented.');
  }
}
