import { AuthorizedCommitteeMemo } from './authorized-committee-memo.model';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from '../../scha-transaction.model';

// TODO - Only interested in title currently, will be implemented later
export class INDIVIDUAL_AC_TRANSFER_MEMO extends AuthorizedCommitteeMemo {
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.INDIVIDUAL_AC_TRANSFER_MEMO);
}
