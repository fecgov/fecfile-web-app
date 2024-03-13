import { ReattRedesTypes, ReattRedesUtils } from './reatt-redes.utils';
import { SchBTransaction } from '../../models/schb-transaction.model';
import { getReportCodeLabel } from '../report-code.utils';
import { Form3X } from 'app/shared/models/form-3x.model';

export class RedesignatedUtils {
  public static overlayTransactionProperties(transaction: SchBTransaction, activeReportId?: string): SchBTransaction {
    if (!transaction.reattribution_redesignation_tag) {
      if (transaction.expenditure_purpose_descrip) {
        const prefix = `[Original purpose description: ${transaction.expenditure_purpose_descrip}] `;
        ReattRedesUtils.updateMemo(transaction, prefix);
      }
      if (transaction.report_ids?.includes(activeReportId as string)) {
        transaction.expenditure_purpose_descrip = 'See redesignation below.';
      } else {
        transaction.expenditure_purpose_descrip = `(Originally disclosed on ${getReportCodeLabel(transaction.getForm3X()?.report_code)}.) See redesignation below.`;
      }
      transaction.reattribution_redesignation_tag = ReattRedesTypes.REDESIGNATED;
    }

    Object.assign(transaction.transactionType, {
      accordionTitle: 'AUTO-POPULATED',
      accordionSubText: 'Review contact, disbursement, and additional information in the redesignation from section.',
      hideContactLookup: true,
    });

    transaction.fields_to_validate = transaction.fields_to_validate?.filter(
      (field) => field !== 'expenditure_purpose_descrip',
    );

    return transaction;
  }
}
