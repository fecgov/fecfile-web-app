import { ReattRedesTypes } from './reatt-redes.utils';
import { SchATransaction } from '../../models/scha-transaction.model';
import { cloneDeep } from 'lodash';
import { MemoText } from "../../models/memo-text.model";

export class ReattributedUtils {
  public static overlayTransactionProperties(transaction: SchATransaction, activeReportId?: string): SchATransaction {
    if (!transaction.reattribution_redesignation_tag) {
      if (transaction.report_id === activeReportId) {
        transaction.contribution_purpose_descrip = 'See reattribution below.';
      } else {
        transaction.report_id = activeReportId;
        transaction.contribution_purpose_descrip = `(Originally disclosed on ${transaction.report?.report_type}.) See attribution below.`;
      }
      transaction.reattribution_redesignation_tag = ReattRedesTypes.REATTRIBUTED;

      const prefix = `[Original purpose description: ${transaction.contribution_purpose_descrip}] `;
      if (transaction.memo_text) {
        transaction.memo_text.text_prefix = prefix;
        transaction.memo_text.text4000 = prefix + transaction?.memo_text?.text4000;
      } else {
        transaction.memo_text = MemoText.fromJSON({
          text_prefix: prefix,
          text4000: prefix,
        });
      }
    }

    Object.assign(transaction.transactionType, {
      accordionTitle: 'AUTO-POPULATED',
      accordionSubText: 'Review contact, receipt, and additional information in the reattribution from section.',
    });

    transaction.fields_to_validate = transaction.fields_to_validate?.filter(
      (field) => field !== 'contribution_purpose_descrip',
    );

    return transaction;
  }

  static getPayload(payload: SchATransaction, originatingTransaction: SchATransaction): SchATransaction {
    if (!originatingTransaction.transaction_type_identifier) {
      throw Error('Fecfile online: originating reattribution transaction type not found.');
    }
    const reattributed = cloneDeep(payload.reatt_redes) as SchATransaction;
    reattributed.reatt_redes = originatingTransaction;
    reattributed.reatt_redes_id = originatingTransaction.id;
    reattributed.report_id = payload.report_id;
    reattributed.id = undefined;
    reattributed.report = undefined;
    reattributed.memo_code = true;
    reattributed.contribution_purpose_descrip = `(Originally disclosed on ${originatingTransaction.report?.report_type}.) See attribution below.`;
    reattributed.reattribution_redesignation_tag = ReattRedesTypes.REATTRIBUTED;
    reattributed.force_unaggregated = true;
    reattributed.fields_to_validate = reattributed.fields_to_validate?.filter(
      (field) => field !== 'contribution_purpose_descrip',
    );
    return reattributed;
  }
}
