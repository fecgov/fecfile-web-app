import { ReattRedesTypes, ReattRedesUtils } from './reatt-redes.utils';
import { FormGroup } from '@angular/forms';
import { getTransactionName, TransactionTypes } from '../../models/transaction.model';
import { SchBTransaction } from '../../models/schb-transaction.model';
import { ContactTypes } from "../../models/contact.model";
import { TemplateMapKeyType } from "../../models/transaction-type.model";

export class RedesignationToUtils {
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
    }
    if (activeReportId) transaction.report_id = activeReportId;
    transaction.reattribution_redesignation_tag = ReattRedesTypes.REDESIGNATION_TO;

    Object.assign(transaction.transactionType, {
      title: 'Redesignation',
      subTitle:
        'The portion of a contribution that has been designated by the contributor, in writing, to an election other than the one for which the funds were originally given.',
      accordionTitle: 'ENTER DATA',
      accordionSubText: 'Redesignate a contribution or a portion of it to a different election.',
      formTitle: 'Redesignation to',
      contactTitle: 'Contact',
      dateLabel: 'REDESIGNATION DATE',
      amountLabel: 'REDESIGNATED AMOUNT',
      footer:
        'The information in this redesignation will automatically create a related disbursement. Review the disbursement, or continue without reviewing and "Save transactions."',
      dependentChildTransactionTypes: [transaction.transaction_type_identifier as TransactionTypes],
      generatePurposeDescription: (transaction: SchBTransaction): string => {
        if (!transaction.reatt_redes) return '';
        const name = getTransactionName(transaction.reatt_redes as SchBTransaction);
        return `Redesignation from ${name}`;
      },
      hidePrimaryContactLookup: true,
    });

    // Remove purpose description and memo code from list of fields to validate on the backend
    transaction.fields_to_validate = transaction.fields_to_validate?.filter(
      (field) =>
        field !== transaction.transactionType.templateMap.purpose_description &&
        field !== transaction.transactionType.templateMap.memo_code
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
    'purpose_description',
    'committee_fec_id',
    'committee_name',
    'category_code'
  ];

  public static overlayForm(form: FormGroup, toTransaction: SchBTransaction): FormGroup {
    // Add additional amount validation
    form
      .get(toTransaction.transactionType.templateMap.amount)
      ?.addValidators([ReattRedesUtils.amountValidator(toTransaction)]);

    // Clear normal schema validation from redesignation TO form
    form.get(toTransaction.transactionType.templateMap.purpose_description)?.clearValidators();
    form.get('memo_code')?.clearValidators();
    form.get('memo_code')?.setValue(false);

    // Memo Code required to be X unless original "Redesignated" transaction in current report period
    // if (transaction.report_id === transaction.reatt_redes?.report_id) {
    //   form.get('memo_code')?.setValue(false);
    //   form.get('memo_code')?.enable();
    // } else {
    form.get('memo_code')?.setValue(true);
    form.get('memo_code')?.disable();
    // }
    form.get('entity_type')?.setValue(ContactTypes.COMMITTEE);
    form.get('payee_organization_name')?.setValue(toTransaction.contact_1?.name);
    form.get('beneficiary_committee_fec_id')?.setValue(toTransaction.contact_1?.committee_id);
    RedesignationToUtils.readOnlyFields.forEach((field) =>
      form.get(toTransaction.transactionType.templateMap[field as TemplateMapKeyType])?.disable()
    );
    return form;
  }
}
