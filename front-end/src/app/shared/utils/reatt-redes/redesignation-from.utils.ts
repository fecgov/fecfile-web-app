import { ReattRedesTypes } from './reatt-redes.utils';
import { FormGroup } from '@angular/forms';
import { TemplateMapKeyType } from '../../models/transaction-type.model';
import { SchBTransaction } from '../../models/schb-transaction.model';
import { ContactTypes } from "../../models/contact.model";

export class RedesignationFromUtils {
  public static overlayTransactionProperties(
    transaction: SchBTransaction,
    redesignatedTransaction?: SchBTransaction,
    activeReportId?: string
  ): SchBTransaction {
    if (redesignatedTransaction) {
      transaction.reatt_redes_id = redesignatedTransaction.id;
      transaction.reatt_redes = redesignatedTransaction;
      transaction.contact_1 = redesignatedTransaction.contact_1;
      transaction.contact_1_id = redesignatedTransaction.contact_1_id;
      transaction.contact_2_id = redesignatedTransaction.contact_2_id;
      transaction.contact_2 = redesignatedTransaction.contact_2;
      transaction.election_code = redesignatedTransaction.election_code;
      transaction.election_other_description = redesignatedTransaction.election_other_description;
    }
    if (activeReportId) transaction.report_id = activeReportId;
    transaction.reattribution_redesignation_tag = ReattRedesTypes.REDESIGNATION_FROM;

    Object.assign(transaction.transactionType, {
      accordionTitle: 'AUTO-POPULATED',
      accordionSubText: 'Review contact, disbursement, and additional information in the redesignation from section.',
      title: 'Redesignation from',
      contactTitle: 'Contact',
      dateLabel: 'REDESIGNATION DATE',
      amountLabel: 'REDESIGNATION AMOUNT',
      inheritedFields: ['date', 'memo_code'] as TemplateMapKeyType[],
      hideContactLookup: true,
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
        field !== 'expenditure_purpose_descrip' &&
        field !== 'memo_code'
    );
    return transaction;
  }

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
    'election_code',
    'election_other_description',
    'category_code'
  ];

  public static overlayForm(fromForm: FormGroup, transaction: SchBTransaction, toForm: FormGroup): FormGroup {
    const purposeDescriptionControl = fromForm.get(transaction.transactionType.templateMap.purpose_description);
    // Update purpose description for rules that are independent of the transaction date being in the report.
    purposeDescriptionControl?.clearValidators();
    fromForm.get('memo_code')?.clearValidators();

    const orgName = toForm.get(transaction.transactionType.templateMap.organization_name)?.value;
    const firstName = toForm.get(transaction.transactionType.templateMap.first_name)?.value;
    const lastName = toForm.get(transaction.transactionType.templateMap.last_name)?.value;

    if (toForm.get('entity_type')?.value === ContactTypes.INDIVIDUAL) {
      purposeDescriptionControl?.setValue(`Redesignation to ${lastName}, ${firstName}`);
    } else {
      purposeDescriptionControl?.setValue(`Reattribution to ${orgName}`);
    }

    // Watch for changes to the "TO" transaction amount and copy the negative of it to the "FROM" transaction amount.
    toForm.get(transaction.transactionType.templateMap.amount)?.valueChanges.subscribe((amount) => {
      fromForm.get(transaction.transactionType.templateMap.amount)?.setValue(-1 * parseFloat(amount));
    });
    toForm.get(transaction.transactionType.templateMap.date)?.valueChanges.subscribe((date) => {
      fromForm.get(transaction.transactionType.templateMap.date)?.setValue(date);
    });

    RedesignationFromUtils.readOnlyFields.forEach((field) =>
      fromForm.get(transaction.transactionType.templateMap[field as TemplateMapKeyType])?.disable()
    );

    return fromForm;
  }
}
