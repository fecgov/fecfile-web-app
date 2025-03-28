import { ReattRedesTypes, ReattRedesUtils } from './reatt-redes.utils';
import { SchATransaction } from '../../models/scha-transaction.model';

export class ReattributedUtils {
  public static overlayTransactionProperties(transaction: SchATransaction, activeReportId?: string): SchATransaction {
    if (!transaction.reattribution_redesignation_tag) {
      if (transaction.contribution_purpose_descrip) {
        const prefix = `[Original purpose description: ${transaction.contribution_purpose_descrip}] `;
        ReattRedesUtils.updateMemo(transaction, prefix);
      }
      if (transaction.report_ids?.includes(activeReportId as string)) {
        transaction.contribution_purpose_descrip = 'See reattribution below.';
      } else {
        const report_code: string =
          transaction.getForm3X()?.report_code ?? transaction.getForm3()?.report_code_label ?? '';
        transaction.contribution_purpose_descrip = `(Originally disclosed on ${report_code}.) See reattribution below.`;
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
