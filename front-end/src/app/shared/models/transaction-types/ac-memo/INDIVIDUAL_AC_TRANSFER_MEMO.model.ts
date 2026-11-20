import { AuthorizedCommitteeMemo } from './authorized-committee-memo.model';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from '../../scha-transaction.model';
import { Transaction } from '../../transaction.model';
import { JsonSchema } from 'fecfile-validate';
import { ELECTION_FIELDS, INDIVIDUAL, INDIVIDUAL_FORM_FIELDS } from 'app/shared/utils/transaction-type-properties';

// TODO - Only interested in title currently, will be implemented later
export class INDIVIDUAL_AC_TRANSFER_MEMO extends AuthorizedCommitteeMemo {
  formFields = [...INDIVIDUAL_FORM_FIELDS, ...ELECTION_FIELDS];
  contactTypeOptions = INDIVIDUAL;
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.INDIVIDUAL_AC_TRANSFER_MEMO);
  schema = {} as JsonSchema;

  override getNewTransaction(): Transaction {
    throw new Error('Method not implemented.');
  }
}
