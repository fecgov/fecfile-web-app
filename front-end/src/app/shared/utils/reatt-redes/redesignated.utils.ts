import { ReattRedesTypes } from './reatt-redes.utils';
import { SchBTransaction } from '../../models/schb-transaction.model';
import { TransactionTypeUtils } from '../transaction-type.utils';

export class RedesignatedUtils {
  public static overlayTransactionProperties(transaction: SchBTransaction, activeReportId?: string): SchBTransaction {
    if (!transaction.reattribution_redesignation_tag) {
      if (transaction.report_id === activeReportId) {
        transaction.expenditure_purpose_descrip = 'See redesignation below.';
      } else {
        transaction.expenditure_purpose_descrip = `(Originally disclosed on ${transaction.report?.report_type}.) See attribution below.See redesignation below.`;
      }
      transaction.reattribution_redesignation_tag = ReattRedesTypes.REDESIGNATED;
    }
    transaction.fields_to_validate = transaction.fields_to_validate?.filter(
      (field) => field !== 'expenditure_purpose_descrip',
    );

    return transaction;
  }

  static getPayload(
    payload: SchBTransaction,
    originatingTransaction: SchBTransaction,
    reportId: string | undefined,
  ): SchBTransaction {
    if (!originatingTransaction.transaction_type_identifier) {
      throw Error('Fecfile online: originating reattribution transaction type not found.');
    }
    const redesignated = TransactionTypeUtils.factory(
      originatingTransaction.transaction_type_identifier,
    ).getNewTransaction() as SchBTransaction;
    redesignated.report_id = reportId;
    return this.overlayTransactionProperties(redesignated);
  }
}
