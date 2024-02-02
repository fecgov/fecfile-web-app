import { ReattRedesTypes } from './reatt-redes.utils';
import { SchATransaction } from '../../models/scha-transaction.model';
import { cloneDeep } from 'lodash';
import { MemoText } from '../../models/memo-text.model';

export class ReattributedUtils {
  public static overlayTransactionProperties(transaction: SchATransaction, activeReportId?: string): SchATransaction {
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

    if (!transaction.reattribution_redesignation_tag) {
      if (transaction.report_id === activeReportId) {
        transaction.contribution_purpose_descrip = 'See reattribution below.';
      } else {
        transaction.contribution_purpose_descrip = `(Originally disclosed on ${transaction.report?.reportLabel}.) See attribution below.`;
      }
      transaction.reattribution_redesignation_tag = ReattRedesTypes.REATTRIBUTED;
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

  static getPayload(payload: SchATransaction): SchATransaction {
    if (!payload.reatt_redes?.transaction_type_identifier) {
      throw Error('Fecfile online: originating reattribution transaction type not found.');
    }
    const reattributed = cloneDeep(payload.reatt_redes) as SchATransaction;
    reattributed.reatt_redes = payload.reatt_redes;
    reattributed.reatt_redes_id = payload.reatt_redes.id;
    reattributed.report_id = payload.report_id;
    reattributed.id = undefined;
    reattributed.report = undefined;
    reattributed.memo_code = true;
    reattributed.force_unaggregated = true;
    
    return reattributed;
  }
}
