import { ReattRedesTypes } from './reatt-redes.utils';
import { FormGroup } from '@angular/forms';
import { TemplateMapKeyType } from '../../models/transaction-type.model';
import { SchATransaction } from '../../models/scha-transaction.model';
import { combineLatest, of } from 'rxjs';
import { ContactTypes } from '../../models/contact.model';

export class ReattributionFromUtils {
  private static readOnlyFields = [
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

  public static overlayTransactionProperties(
    transaction: SchATransaction,
    reattributedTransaction?: SchATransaction,
    activeReportId?: string,
  ): SchATransaction {
    if (reattributedTransaction) {
      transaction.reatt_redes_id = reattributedTransaction.id;
      transaction.reatt_redes = reattributedTransaction;
    }
    if (activeReportId) transaction.report_ids?.includes(activeReportId as string);
    transaction.reattribution_redesignation_tag = ReattRedesTypes.REATTRIBUTION_FROM;

    Object.assign(transaction.transactionType, {
      accordionTitle: 'AUTO-POPULATED',
      accordionSubText: 'Review contact, receipt, and additional information in the reattribution from section.',
      formTitle: 'Reattribution from',
      contactTitle: 'Contact',
      dateLabel: 'REATTRIBUTION DATE',
      amountLabel: 'REATTRIBUTED AMOUNT',
      inheritedFields: ['date', 'memo_code'] as TemplateMapKeyType[],
      hideContactLookup: true,
      contactTypeOptions: [(transaction.reatt_redes as SchATransaction).entity_type],

      // noop generatePurposeDescription to inform dynamic input label
      generatePurposeDescription: (transaction: SchATransaction): string => {
        return transaction[
          transaction.transactionType.templateMap.purpose_description as keyof SchATransaction
        ] as string;
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

  public static overlayForm(fromForm: FormGroup, transaction: SchATransaction, toForm: FormGroup): FormGroup {
    const purposeDescriptionControl = fromForm.get(transaction.transactionType.templateMap.purpose_description);
    // Update purpose description for rules that are independent of the transaction date being in the report.
    purposeDescriptionControl?.clearValidators();
    fromForm.get('memo_code')?.clearValidators();

    // Watch for changes to the "TO" transaction entity name and then update the "FROM" transaction expenditure purpose description.
    combineLatest([
      toForm.get(transaction.transactionType.templateMap.organization_name)?.valueChanges ?? of(null),
      toForm.get(transaction.transactionType.templateMap.first_name)?.valueChanges ?? of(null),
      toForm.get(transaction.transactionType.templateMap.last_name)?.valueChanges ?? of(null),
    ]).subscribe(([orgName, firstName, lastName]) => {
      if (toForm.get('entity_type')?.value === ContactTypes.INDIVIDUAL) {
        purposeDescriptionControl?.setValue(`Reattribution to ${lastName}, ${firstName}`);
      } else {
        purposeDescriptionControl?.setValue(`Reattribution to ${orgName}`);
      }
    });

    // Watch for changes to the "TO" transaction amount and copy the negative of it to the "FROM" transaction amount.
    toForm.get(transaction.transactionType.templateMap.amount)?.valueChanges.subscribe((amount) => {
      fromForm.get(transaction.transactionType.templateMap.amount)?.setValue(-1 * parseFloat(amount));
    });

    ReattributionFromUtils.readOnlyFields.forEach((field) =>
      fromForm.get(transaction.transactionType.templateMap[field as TemplateMapKeyType])?.disable(),
    );

    return fromForm;
  }
}
