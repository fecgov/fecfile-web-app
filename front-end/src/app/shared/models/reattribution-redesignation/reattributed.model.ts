import { ReattRedesTypes, ReattributionRedesignationBase } from './reattribution-redesignation-base.model';
import { SchATransaction } from '../scha-transaction.model';

export class Reattributed extends ReattributionRedesignationBase {
  overlayTransactionProperties(transaction: SchATransaction, activeReportId: string): SchATransaction {
    if (transaction.report_id === activeReportId) {
      transaction.memo_text_description = transaction.contribution_purpose_descrip;
      transaction.contribution_purpose_descrip = 'See reattribution below.';
    } else {
      // The originating transaction is not in the current report, so we make a MEMO copy and
      // set the copy reatt_redes_id, reattribution_redesignation_tag, and purpose_description
      transaction.id = undefined;
      transaction.parent_transaction_id = undefined;
      transaction.report_id = activeReportId;
      transaction.reatt_redes_id = transaction.id;
      transaction.children = [];
      transaction.memo_code = true;
      transaction.contribution_purpose_descrip = `(Originally disclosed on ${transaction.report?.report_type}.) See attribution below.`;
    }

    transaction.reattribution_redesignation_tag = ReattRedesTypes.REATTRIBUTED;
    transaction.fields_to_validate = transaction.fields_to_validate?.filter(
      (field) => field !== 'contribution_purpose_descrip'
    );

    return transaction;
  }
}
