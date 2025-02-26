import { ReattRedesTypes } from './reatt-redes.utils';
import { FormGroup } from '@angular/forms';
import { TransactionTypes } from '../../models/transaction.model';
import { SchBTransaction } from '../../models/schb-transaction.model';
import { TemplateMapKeyType } from '../../models/transaction-type.model';
import { DateUtils } from '../date.utils';
import { buildReattRedesTransactionValidator } from 'app/shared/utils/validators.utils';

export class RedesignationToUtils {
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
    }
    if (activeReportId) transaction.report_ids = [activeReportId];
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
      electionLabelPrefix: 'NEW',
      footer:
        'The information in this redesignation will automatically create a related disbursement. Review the disbursement, or continue without reviewing and "Save transactions."',
      dependentChildTransactionTypes: [transaction.transaction_type_identifier as TransactionTypes],
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
    'memo_code',
  ];

  public static overlayForm(form: FormGroup, toTransaction: SchBTransaction): FormGroup {
    // Add additional amount validation
    form
      .get(toTransaction.transactionType.templateMap.amount)
      ?.addValidators([buildReattRedesTransactionValidator(toTransaction)]);

    // Clear normal schema validation from redesignation TO form
    form.get(toTransaction.transactionType.templateMap.purpose_description)?.clearAsyncValidators();
    form.get('memo_code')?.clearAsyncValidators();
    form.get('memo_code')?.setValue(true);

    RedesignationToUtils.readOnlyFields.forEach((field) =>
      form.get(toTransaction.transactionType.templateMap[field as TemplateMapKeyType])?.disable(),
    );
    return form;
  }
}
