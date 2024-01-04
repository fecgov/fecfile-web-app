import { ReattRedesTypes } from './reatt-redes.utils';
import { FormGroup } from '@angular/forms';
import { TemplateMapKeyType } from '../../models/transaction-type.model';
import { SchBTransaction } from '../../models/schb-transaction.model';
import { AbstractFromUtils } from "./abstract-from.utils";

export class RedesignationFromUtils extends AbstractFromUtils {
  public static overlayTransactionProperties(
    transaction: SchBTransaction,
    redesignatedTransaction?: SchBTransaction,
    activeReportId?: string
  ): SchBTransaction {
    if (redesignatedTransaction) {
      transaction.reatt_redes_id = redesignatedTransaction.id;
      transaction.reatt_redes = redesignatedTransaction;
    }
    if (activeReportId) transaction.report_id = activeReportId;
    transaction.reattribution_redesignation_tag = ReattRedesTypes.REDESIGNATION_FROM;

    Object.assign(transaction.transactionType, {
      accordionTitle: 'AUTO-POPULATED',
      accordionSubText: 'Review contact, receipt, and additional information in the reattribution from section.',
      title: 'Redesignation from',
      contactTitle: 'Contact',
      dateLabel: 'REDESIGNATION DATE',
      amountLabel: 'REDESIGNATION AMOUNT',
      inheritedFields: ['date', 'memo_code'] as TemplateMapKeyType[],
      hidePrimaryContactLookup: true,
      contactTypeOptions: [(transaction.reatt_redes as SchBTransaction).entity_type],
      // noop generatePurposeDescription to inform dynamic input label
      generatePurposeDescription: (transaction: SchBTransaction): string => {
        return transaction[
          transaction.transactionType.templateMap.purpose_description as keyof SchBTransaction
          ] as string;
      },
    });

    // Remove purpose description and memo code from list of fields to validate on the backend
    transaction.fields_to_validate = transaction.fields_to_validate?.filter(
      (field) =>
        field !== transaction.transactionType.templateMap.purpose_description &&
        field !== transaction.transactionType.templateMap.memo_code
    );

    return transaction;
  }

  public static override overlayForm(fromForm: FormGroup, transaction: SchBTransaction, toForm: FormGroup): FormGroup {
    return super.overlayForm(fromForm, transaction, toForm, 'Redesignation');
  }
}
