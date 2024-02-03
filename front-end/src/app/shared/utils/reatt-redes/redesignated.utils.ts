import { ReattRedesTypes } from './reatt-redes.utils';
import { SchBTransaction } from '../../models/schb-transaction.model';
import { cloneDeep } from 'lodash';
import { MemoText } from '../../models/memo-text.model';
import { getReportCodeLabel } from '../report-code.utils';

export class RedesignatedUtils {
  public static overlayTransactionProperties(transaction: SchBTransaction, activeReportId?: string): SchBTransaction {
    if (!transaction.report) throw new Error('Transaction missing report');

    if (!transaction.reattribution_redesignation_tag) {
      if (transaction.expenditure_purpose_descrip) {
        const prefix = `[Original purpose description: ${transaction.expenditure_purpose_descrip}] `;
        if (transaction.memo_text) {
          if (!transaction.memo_text.text_prefix) {
            transaction.memo_text.text_prefix = prefix;
            transaction.memo_text.text4000 = prefix + transaction?.memo_text?.text4000;
          }
        } else {
          transaction.memo_text = MemoText.fromJSON({
            rec_type: 'TEXT',
            report_id: transaction?.report_id,
            text_prefix: prefix,
            text4000: prefix,
          });
        }
      }
      if (transaction.report_id === activeReportId) {
        transaction.expenditure_purpose_descrip = 'See redesignation below.';
      } else {
        transaction.expenditure_purpose_descrip = `(Originally disclosed on ${getReportCodeLabel(transaction.report?.reportCode)}.) See redesignation below.`;
      }
      transaction.reattribution_redesignation_tag = ReattRedesTypes.REDESIGNATED;
    }

    Object.assign(transaction.transactionType, {
      accordionTitle: 'AUTO-POPULATED',
      accordionSubText: 'Review contact, disbursement, and additional information in the redesignation from section.',
    });

    transaction.fields_to_validate = transaction.fields_to_validate?.filter(
      (field) => field !== 'expenditure_purpose_descrip',
    );

    return transaction;
  }

  static getPayload(payload: SchBTransaction): SchBTransaction {
    if (!payload.reatt_redes?.transaction_type_identifier) {
      throw Error('Fecfile online: originating redesignation transaction type not found.');
    }
    const redesignated = cloneDeep(payload.reatt_redes) as SchBTransaction;
    redesignated.report_id = payload.report_id;
    redesignated.reatt_redes = payload.reatt_redes;
    redesignated.reatt_redes_id = payload.reatt_redes.id;
    redesignated.id = undefined;
    redesignated.report = undefined;
    redesignated.memo_code = true;
    redesignated.force_unaggregated = true;
    redesignated.children = []; // Children of original transaction do not copy over.

    return redesignated;
  }
}
