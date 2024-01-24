import { ReattRedesTypes } from './reatt-redes.utils';
import { SchATransaction } from '../../models/scha-transaction.model';
import { MemoText } from 'app/shared/models/memo-text.model';

export class ReattributedUtils {
  public static overlayTransactionProperties(transaction: SchATransaction, activeReportId?: string): SchATransaction {
    if (!transaction.reattribution_redesignation_tag) {
      const prefix = `[Original purpose description: ${transaction?.contribution_purpose_descrip}] `;
      if (transaction.memo_text) {
        transaction.memo_text.text_prefix = prefix;
        transaction.memo_text.text4000 = prefix + transaction?.memo_text?.text4000;
      } else {
        transaction.memo_text = MemoText.fromJSON({
          text_prefix: prefix,
          text4000: prefix,
        });
      }
      if (transaction.report_id === activeReportId) {
        transaction.contribution_purpose_descrip = 'See reattribution below.';
      } else {
        alert('Not implemented yet. Only implement transactions in the current report.');
        return transaction;
      }

      transaction.reattribution_redesignation_tag = ReattRedesTypes.REATTRIBUTED;
    }

    transaction.fields_to_validate = transaction.fields_to_validate?.filter(
      (field) => field !== 'contribution_purpose_descrip'
    );

    return transaction;
  }
}
