import { ReattRedesTypes, ReattributionRedesignationBase } from './reattribution-redesignation-base.model';
import { SchATransaction } from '../scha-transaction.model';
import { getFromJSON } from 'app/shared/utils/transaction-type.utils';

export class Reattributed extends ReattributionRedesignationBase {
  overlayTransactionProperties(transaction: SchATransaction, activeReportId: string): (SchATransaction | undefined)[] {
    let copy;

    if (transaction.report_id === activeReportId) {
      transaction.memo_text_description = transaction.contribution_purpose_descrip;
      transaction.contribution_purpose_descrip = 'See reattribution below.';
    } else {
      // The originating transaction is not in the current report, so we make a MEMO copy and tag it REATTRIBUTED/REDESIGNATED.
      // And set the copy reatt_redes_id, reattribution_redesignation_tag, and purpose_description
      copy = getFromJSON({ ...transaction }) as SchATransaction;
      copy.id = undefined;
      copy.report_id = activeReportId;
      copy.reatt_redes_id = transaction.id;
      copy.children = [];
      copy.memo_code = true;
      copy.reattribution_redesignation_tag = ReattRedesTypes.REATTRIBUTED;
      copy.contribution_purpose_descrip = `(Originally disclosed on ${transaction.report?.report_type}.) See attribution below.`;
      copy.fields_to_validate = transaction.fields_to_validate?.filter(
        (field) => field !== 'contribution_purpose_descrip'
      );
    }

    transaction.fields_to_validate = transaction.fields_to_validate?.filter(
      (field) => field !== 'contribution_purpose_descrip'
    );

    return [transaction, copy];
  }
}
