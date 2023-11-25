import { combineLatest, of } from 'rxjs';
import { ReattributionRedesignationBase, ReattRedesTypes } from './reattribution-redesignation-base.model';
import { FormGroup } from '@angular/forms';
import { TemplateMapKeyType } from '../transaction-type.model';
import { SchATransaction } from '../scha-transaction.model';
import { ContactTypes } from '../contact.model';

export class ReattributionFrom extends ReattributionRedesignationBase {
  overlayTransactionProperties(
    transaction: SchATransaction,
    reattributedTransaction: SchATransaction,
    activeReportId: string
  ): SchATransaction {
    transaction.reatt_redes_id = reattributedTransaction.id;
    transaction.reattribution_redesignation_tag = ReattRedesTypes.REATTRIBUTION_FROM;
    transaction.report_id = activeReportId;

    Object.assign(transaction.transactionType, {
      accordionTitle: 'AUTO-POPULATED',
      accordionSubText: 'Review contact, receipt, and additional information in the reattribution from section.',
      title: 'Reattribution from',
      contactTitle: 'Contact',
      dateLabel: 'REATTRIBUTION DATE',
      amountLabel: 'REATTRIBUTED AMOUNT',
      inheritedFields: ['date', 'memo_code'] as TemplateMapKeyType[],
      hidePrimaryContactLookup: true,
      contactTypeOptions: [reattributedTransaction.entity_type],
    });

    // Remove purpose description and memo code from list of fields to validate on the backend
    transaction.fields_to_validate = transaction.fields_to_validate?.filter(
      (field) =>
        field !== transaction.transactionType.templateMap.purpose_description &&
        field !== transaction.transactionType.templateMap.memo_code
    );

    return transaction;
  }

  overlayForm(fromForm: FormGroup, transaction: SchATransaction, toForm: FormGroup): FormGroup {
    // Add additional amount validation
    const reattributedTransaction = transaction.parent_transaction?.reatt_redes as SchATransaction;

    if (reattributedTransaction) {
      fromForm
        .get(transaction.transactionType.templateMap.amount)
        ?.addValidators([this.amountValidator(reattributedTransaction, true)]);
    }

    // Update purpose description for rules that are independent of the transaction date being in the report.
    fromForm.get('contribution_purpose_descrip')?.clearValidators();
    fromForm.get('memo_code')?.clearValidators();

    // Watch for changes to the "TO" transaction entity name and then update the "FROM" transaction contribution purpose description.
    combineLatest([
      toForm.get(transaction.transactionType.templateMap.organization_name)?.valueChanges ?? of(null),
      toForm.get(transaction.transactionType.templateMap.first_name)?.valueChanges ?? of(null),
      toForm.get(transaction.transactionType.templateMap.last_name)?.valueChanges ?? of(null),
    ]).subscribe(([orgName, firstName, lastName]) => {
      if (toForm.get('entity_type')?.value === ContactTypes.INDIVIDUAL) {
        fromForm.get('contribution_purpose_descrip')?.setValue(`Reattribution to ${lastName}, ${firstName}`);
      } else {
        fromForm.get('contribution_purpose_descrip')?.setValue(`Reattribution to ${orgName}`);
      }
    });

    // Watch for changes to the "TO" transaction amount and copy the negative of it to the "FROM" transaction amount.
    toForm.get(transaction.transactionType.templateMap.amount)?.valueChanges.subscribe((amount) => {
      fromForm.get(transaction.transactionType.templateMap.amount)?.setValue(-1 * parseFloat(amount));
    });

    const readOnlyFields = [
      'organization_name',
      'last_name',
      'first_name',
      'middle_name',
      'prefix',
      'suffix',
      'employer',
      'occupation',
      'street_1',
      'street_2',
      'city',
      'state',
      'zip',
      'amount',
      'purpose_description',
      'committee_fec_id',
      'committee_name',
    ];
    readOnlyFields.forEach((field) =>
      fromForm.get(transaction.transactionType.templateMap[field as TemplateMapKeyType])?.disable()
    );

    return fromForm;
  }
}
