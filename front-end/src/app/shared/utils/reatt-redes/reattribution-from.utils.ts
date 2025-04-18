import { ReattRedesTypes } from './reatt-redes.utils';
import { TemplateMapKeyType } from '../../models/transaction-type.model';
import { SchATransaction } from '../../models/scha-transaction.model';

export class ReattributionFromUtils {
  static readonly readOnlyFields = [
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
    if (activeReportId) transaction.report_ids = [activeReportId];
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
}
