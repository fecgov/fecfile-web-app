import { ReattRedesTypes } from './reatt-redes.utils';
import { SchBTransaction } from '../../models/schb-transaction.model';
import { cloneDeep } from 'lodash';

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

  static getPayload(payload: SchBTransaction, originatingTransaction: SchBTransaction): SchBTransaction {
    if (!originatingTransaction.transaction_type_identifier) {
      throw Error('Fecfile online: originating reattribution transaction type not found.');
    }
    const redesignated = cloneDeep(payload.reatt_redes) as SchBTransaction;
    redesignated.report_id = payload.report_id;
    redesignated.id = undefined;
    redesignated.report = undefined;
    redesignated.expenditure_purpose_descrip = `(Originally disclosed on ${payload.report?.report_type}.) See attribution below.See redesignation below.`;
    redesignated.reattribution_redesignation_tag = ReattRedesTypes.REDESIGNATED;
    redesignated.force_unaggregated = true;
    redesignated.fields_to_validate = redesignated.fields_to_validate?.filter(
      (field) => field !== 'expenditure_purpose_descrip',
    );
    return redesignated;
  }
}
