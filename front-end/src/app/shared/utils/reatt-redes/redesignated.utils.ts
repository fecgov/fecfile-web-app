import { ReattRedesTypes } from './reatt-redes.utils';
import { SchBTransaction } from '../../models/schb-transaction.model';

export class RedesignatedUtils {
  public static overlayTransactionProperties(transaction: SchBTransaction, activeReportId?: string): SchBTransaction {
    if (!transaction.reattribution_redesignation_tag) {
      if (transaction.report_id === activeReportId) {
        transaction.expenditure_purpose_descrip = 'See redesignation below.';
      } else {
        alert('Not implemented yet. Only implement transactions in the current report.');
        return transaction;
        // // The originating transaction is not in the current report, so we make a MEMO copy and
        // // set the copy reatt_redes_id, reattribution_redesignation_tag, and purpose_description
        // transaction.id = undefined;
        // transaction.parent_transaction_id = undefined;
        // transaction.report_id = activeReportId;
        // transaction.reatt_redes_id = transaction.id;
        // transaction.children = [];
        // transaction.memo_code = true;
        // transaction.expenditure_purpose_descrip = `(Originally disclosed on ${transaction.report?.report_type}.) See attribution below.`;
      }

      transaction.reattribution_redesignation_tag = ReattRedesTypes.REDESIGNATED;
    }

    transaction.fields_to_validate = transaction.fields_to_validate?.filter(
      (field) => field !== 'expenditure_purpose_descrip'
    );

    return transaction;
  }
}
