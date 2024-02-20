import { ReattRedesTypes, ReattRedesUtils } from './reatt-redes.utils';
import { SchATransaction } from '../../models/scha-transaction.model';
import { getReportCodeLabel } from '../report-code.utils';
import { Form3X } from '../../models/form-3x.model';

export class ReattributedUtils {
  public static overlayTransactionProperties(transaction: SchATransaction, activeReportId?: string): SchATransaction {
    if (!transaction.reattribution_redesignation_tag) {
      if (transaction.contribution_purpose_descrip) {
        const prefix = `[Original purpose description: ${transaction.contribution_purpose_descrip}] `;
        ReattRedesUtils.updateMemo(transaction, prefix);
      }
      if (transaction.report_id === activeReportId) {
        transaction.contribution_purpose_descrip = 'See reattribution below.';
      } else {
        transaction.contribution_purpose_descrip = `(Originally disclosed on ${getReportCodeLabel((transaction.report as Form3X).report_code)}.) See reattribution below.`;
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
}
