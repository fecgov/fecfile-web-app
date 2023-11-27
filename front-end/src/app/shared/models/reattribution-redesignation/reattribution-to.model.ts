import { ReattributionRedesignationBase, ReattRedesTypes } from './reattribution-redesignation-base.model';
import { FormGroup } from '@angular/forms';
import { TransactionTypes, getTransactionName } from '../transaction.model';
import { SchATransaction } from '../scha-transaction.model';

export class ReattributionTo extends ReattributionRedesignationBase {
  overlayTransactionProperties(
    transaction: SchATransaction,
    reattributedTransaction: SchATransaction,
    activeReportId?: string
  ): SchATransaction {
    transaction.reatt_redes_id = reattributedTransaction.id;
    transaction.reatt_redes = reattributedTransaction;
    transaction.reattribution_redesignation_tag = ReattRedesTypes.REATTRIBUTION_TO;
    if (activeReportId) transaction.report_id = activeReportId;

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
        'The information in this rattribution will automatically create a related receipt. Review the receipt, or continue without reviewing and "Save transactions."',
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
        field !== transaction.transactionType.templateMap.memo_code
    );

    return transaction;
  }

  overlayForm(form: FormGroup, transaction: SchATransaction): FormGroup {
    // Add additional amount validation
    const reattributedTransaction = transaction.reatt_redes as SchATransaction;
    if (reattributedTransaction) {
      form
        .get(transaction.transactionType.templateMap.amount)
        ?.addValidators([this.amountValidator(reattributedTransaction)]);
    }

    // Clear normal schema validation from reattribution TO form
    form.get('contribution_purpose_descrip')?.clearValidators();
    form.get('memo_code')?.clearValidators();
    form.get('memo_code')?.setValue(false);

    // Memo Code required to be X unless original "Reattributed" transaction in current report period
    // if (transaction.report_id === transaction.reatt_redes?.report_id) {
    //   form.get('memo_code')?.setValue(false);
    //   form.get('memo_code')?.enable();
    // } else {
    form.get('memo_code')?.setValue(true);
    form.get('memo_code')?.disable();
    // }

    return form;
  }
}
