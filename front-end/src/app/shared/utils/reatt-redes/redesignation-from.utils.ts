import { ReattRedesTypes } from './reatt-redes.utils';
import { FormGroup } from '@angular/forms';
import { TemplateMapKeyType } from '../../models/transaction-type.model';
import { SchBTransaction } from '../../models/schb-transaction.model';
import { DateUtils } from '../date.utils';

export class RedesignationFromUtils {
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
    'date',
    'amount',
    'purpose_description',
    'committee_fec_id',
    'committee_name',
    'election_code',
    'election_other_description',
    'category_code',
    'candidate_fec_id',
    'candidate_last_name',
    'candidate_first_name',
    'candidate_middle_name',
    'candidate_prefix',
    'candidate_suffix',
    'candidate_office',
    'candidate_state',
    'candidate_district',
  ];

  public static overlayTransactionProperties(
    transaction: SchBTransaction,
    redesignatedTransaction?: SchBTransaction,
    activeReportId?: string,
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
    if (activeReportId) transaction.report_ids?.push(activeReportId);
    transaction.reattribution_redesignation_tag = ReattRedesTypes.REDESIGNATION_FROM;

    Object.assign(transaction.transactionType, {
      accordionTitle: 'AUTO-POPULATED',
      accordionSubText: 'Review contact, disbursement, and additional information in the redesignation from section.',
      formTitle: 'Redesignation from',
      contactTitle: 'Contact',
      dateLabel: 'REDESIGNATION DATE',
      amountLabel: 'REDESIGNATED AMOUNT',
      generatePurposeDescription: (transaction: SchBTransaction): string => {
        if (!transaction.reatt_redes) return '';
        const expenditureDate = (transaction.reatt_redes as SchBTransaction).expenditure_date;
        if (!expenditureDate) throw new Error('No Expenditure Date!');
        return `Redesignation - Contribution from ${DateUtils.convertDateToSlashFormat(expenditureDate)}`;
      },
      hideContactLookup: true,
    });

    // Remove purpose description and memo code from list of fields to validate on the backend
    transaction.fields_to_validate = transaction.fields_to_validate?.filter(
      (field) => field !== 'expenditure_purpose_descrip' && field !== 'memo_code',
    );
    return transaction;
  }

  public static overlayForm(fromForm: FormGroup, transaction: SchBTransaction, toForm: FormGroup): FormGroup {
    const templateMap = transaction.transactionType.templateMap;
    const purposeDescriptionControl = fromForm.get(templateMap.purpose_description);
    // Update purpose description for rules that are independent of the transaction date being in the report.
    purposeDescriptionControl?.clearValidators();
    fromForm.get('memo_code')?.clearValidators();
    fromForm.get('memo_code')?.setValue(true);

    // Watch for changes to the "TO" transaction amount and copy the negative of it to the "FROM" transaction amount.
    toForm.get(templateMap.amount)?.valueChanges.subscribe((amount) => {
      fromForm.get(templateMap.amount)?.setValue(-1 * parseFloat(amount));
    });
    toForm.get(templateMap.date)?.valueChanges.subscribe((date) => {
      fromForm.get(templateMap.date)?.setValue(date);
    });

    RedesignationFromUtils.readOnlyFields.forEach((field) =>
      fromForm.get(templateMap[field as TemplateMapKeyType])?.disable(),
    );

    return fromForm;
  }
}
