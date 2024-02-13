import { ReattRedesUtils, ReattRedesTypes } from './reatt-redes.utils';
import { FormGroup } from '@angular/forms';
import { TransactionTypes, getTransactionName } from '../../models/transaction.model';
import { SchATransaction } from '../../models/scha-transaction.model';

export class ReattributionToUtils {
  public static overlayTransactionProperties(
    transaction: SchATransaction,
    reattributedTransaction?: SchATransaction,
    activeReportId?: string,
  ): SchATransaction {
    if (reattributedTransaction) {
      transaction.reatt_redes_id = reattributedTransaction.id;
      transaction.reatt_redes = reattributedTransaction;
    }
    if (activeReportId) transaction.report_id = activeReportId;
    transaction.reattribution_redesignation_tag = ReattRedesTypes.REATTRIBUTION_TO;

    Object.assign(transaction.transactionType, {
      title: 'Reattribution',
      subTitle:
        'The portion of an excessive contribution that has been attributed, in writing, to another contributor and signed by both contributors.',
      accordionTitle: 'ENTER DATA',
      accordionSubText: 'Reattribute a contribution or a portion of it to a different contributor.',
      formTitle: 'Reattribution to',
      contactTitle: 'Contact',
      dateLabel: 'REATTRIBUTION DATE',
      amountLabel: 'REATTRIBUTED AMOUNT',
      footer:
        'The information in this reattribution will automatically create a related receipt. Review the receipt, or continue without reviewing and "Save transactions."',
      dependentChildTransactionTypes: [transaction.transaction_type_identifier as TransactionTypes],

      generatePurposeDescription: (transaction: SchATransaction): string => {
        if (!transaction.reatt_redes) return '';
        const name = getTransactionName(transaction.reatt_redes as SchATransaction);
        return `Reattribution from ${name}`;
      },
    });

    // Remove purpose description and memo code from list of fields to validate on the backend
    transaction.fields_to_validate = transaction.fields_to_validate?.filter(
      (field) =>
        field !== transaction.transactionType.templateMap.purpose_description &&
        field !== transaction.transactionType.templateMap.memo_code,
    );

    return transaction;
  }

  public static overlayForm(form: FormGroup, transaction: SchATransaction): FormGroup {
    // Add additional amount validation
    form
      .get(transaction.transactionType.templateMap.amount)
      ?.addValidators([ReattRedesUtils.amountValidator(transaction)]);

    // Clear normal schema validation from reattribution TO form
    form.get('contribution_purpose_descrip')?.clearValidators();
    form.get('memo_code')?.clearValidators();
    form.get('memo_code')?.setValue(true);
    form.get('memo_code')?.disable();

    return form;
  }
}
