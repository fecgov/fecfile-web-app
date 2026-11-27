import { LabelUtils } from 'app/shared/utils/label.utils';
import { ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from '../../scha-transaction.model';
import { AuthorizedCommitteeMemo } from './authorized-committee-memo.model';

export class PARTNERSHIP_ATTRIBUTION_AC_TRANSFER_MEMO extends AuthorizedCommitteeMemo {
  title = LabelUtils.get(
    ScheduleATransactionTypeLabels,
    ScheduleATransactionTypes.PARTNERSHIP_ATTRIBUTION_AC_TRANSFER_MEMO,
  );
}
