import { ReattRedesTypes } from './reatt-redes.utils';
import { SchATransaction } from '../../models/scha-transaction.model';
import { cloneDeep } from 'lodash';

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
    }

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
    reattributed.report_id = payload.report_id;
    reattributed.id = undefined;
    reattributed.report = undefined;
    reattributed.contribution_purpose_descrip = `(Originally disclosed on ${originatingTransaction.report?.report_type}.) See attribution below.`;
    reattributed.reattribution_redesignation_tag = ReattRedesTypes.REATTRIBUTED;

    reattributed.fields_to_validate = reattributed.fields_to_validate?.filter(
      (field) => field !== 'contribution_purpose_descrip',
    );
    return reattributed;
  }
}
