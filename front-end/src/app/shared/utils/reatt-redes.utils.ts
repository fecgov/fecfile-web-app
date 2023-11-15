import { FormGroup, AbstractControl, Validators, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Form3X } from 'app/shared/models/form-3x.model';
import { DateUtils } from './date.utils';
import { Transaction, TransactionTypes } from '../models/transaction.model';
import { SchATransaction } from '../models/scha-transaction.model';
import { SchBTransaction } from '../models/schb-transaction.model';
import { ContactTypes } from '../models/contact.model';
import { TemplateMapKeyType } from '../models/transaction-type.model';

export enum ReattRedesTypes {
  REATTRIBUTED = 'REATTRIBUTED',
  REDESIGNATED = 'REDESIGNATED',
  REATTRIBUTION_FROM = 'REATTRIBUTION_FROM',
  REATTRIBUTION_TO = 'REATTRIBUTION_TO',
  REDESIGNATION_FROM = 'REDESIGNATION_FROM',
  REDESIGNATION_TO = 'REDESIGNATION_TO',
}

/**
 * This class manages the special validation and text written to the purpose description
 * fields of Schedule A and Schedule B transactions that are part of a reattribution
 * or redesignation.
 */
export class ReattRedesUtils {
  public static initValidators(
    form: FormGroup,
    transaction: SchATransaction | SchBTransaction,
    activeReport: Form3X
  ): void {
    // Add additional amount validation
    form.get(transaction.transactionType.templateMap.amount)?.addValidators([amountValidator(transaction)]);

    // Update purpose description for rules that are independent of the transaction date being in the report.
    const pdKey = transaction.transactionType.templateMap.purpose_description;
    form.get(pdKey)?.clearValidators();
    if (!transaction.id) form.get(pdKey)?.setValue(''); // Clear out old description on create so user does not see it.
    if (transaction.reattribution_redesignation_tag === ReattRedesTypes.REATTRIBUTION_FROM) {
      form
        .get(pdKey)
        ?.setValue(`Reattribution to ${getName(transaction.parent_transaction as SchATransaction | SchBTransaction)}`);
    }
    if (transaction.reattribution_redesignation_tag === ReattRedesTypes.REATTRIBUTION_TO) {
      form
        .get(pdKey)
        ?.setValue(
          `Reattribution from ${getName(transaction.parent_transaction as SchATransaction | SchBTransaction)}`
        );
    }
    if (
      transaction.reattribution_redesignation_tag === ReattRedesTypes.REDESIGNATION_FROM ||
      transaction.reattribution_redesignation_tag === ReattRedesTypes.REDESIGNATION_TO
    ) {
      const originatorDate = (transaction.parent_transaction as SchATransaction & SchBTransaction)[
        transaction.transactionType.templateMap.date as keyof (SchATransaction & SchBTransaction)
      ] as Date;
      const displayDate = DateUtils.convertDateToFecFormat(originatorDate);
      const conjunction =
        transaction.reattribution_redesignation_tag === ReattRedesTypes.REDESIGNATION_FROM ? 'to' : 'from';
      form.get(pdKey)?.setValue(`Redesignation - Contribution ${conjunction} ${displayDate}`);
    }
    form.get(pdKey)?.disable();

    // Watch transaction date for changes and update validation and purpose description text as appropriate.
    form.get(transaction.transactionType.templateMap.date)?.valueChanges.subscribe((transactionDate) => {
      ReattRedesUtils.updateValidators(transactionDate, form, transaction, activeReport);
    });

    // Remove purpose description and memo code from list of fields to validate on the backend
    transaction.fields_to_validate = transaction.fields_to_validate?.filter(
      (field) =>
        field !== transaction.transactionType.templateMap.purpose_description &&
        field !== transaction.transactionType.templateMap.memo_code
    );
  }

  /**
   * This is the callback that fires whenever the user updates the amount field on the
   * transaction input form.
   * @param transactionDate
   * @param form
   * @param transaction
   * @param activeReport
   */
  public static updateValidators(
    transactionDate: Date,
    form: FormGroup,
    transaction: SchATransaction | SchBTransaction,
    activeReport: Form3X
  ): void {
    // Is this transaction in the current report's period?
    const inCurrentReportPeriod = DateUtils.isWithin(
      transactionDate,
      activeReport.coverage_from_date,
      activeReport.coverage_through_date
    );

    // Write appropriate purpose description to the form field.
    const pdKey = transaction.transactionType.templateMap.purpose_description;
    if (transaction.reattribution_redesignation_tag === ReattRedesTypes.REATTRIBUTED && !inCurrentReportPeriod) {
      const reportLabel = (transaction.parent_transaction?.report as Form3X)?.report_code;
      form.get(pdKey)?.setValue(`(Originally disclosed on ${reportLabel}.) See reattribution below.`);
    }
    if (transaction.reattribution_redesignation_tag === ReattRedesTypes.REATTRIBUTED && inCurrentReportPeriod) {
      form.get(pdKey)?.setValue('See reattribution below.');
    }
    if (transaction.reattribution_redesignation_tag === ReattRedesTypes.REDESIGNATED && !inCurrentReportPeriod) {
      const reportLabel = (transaction.parent_transaction?.report as Form3X)?.report_code;
      form.get(pdKey)?.setValue(`(Originally disclosed on ${reportLabel}.) See redesignation below.`);
    }
    if (transaction.reattribution_redesignation_tag === ReattRedesTypes.REDESIGNATED && inCurrentReportPeriod) {
      form.get(pdKey)?.setValue('See redesignation below.');
    }

    // Update memo_code validation rules
    form.get(transaction.transactionType.templateMap.memo_code)?.clearValidators();
    if (
      !(
        (transaction.reattribution_redesignation_tag === ReattRedesTypes.REATTRIBUTED ||
          transaction.reattribution_redesignation_tag === ReattRedesTypes.REDESIGNATED) &&
        inCurrentReportPeriod
      )
    ) {
      form.get(transaction.transactionType.templateMap.memo_code)?.setValidators([Validators.required]);
    }
  }

  public static isReattRedes(transaction: Transaction | undefined, types: ReattRedesTypes[] = []): boolean {
    if (!transaction || !('reattribution_redesignation_tag' in transaction)) return false;
    if (types.length === 0) return !!transaction.reattribution_redesignation_tag;
    return types.includes(transaction.reattribution_redesignation_tag as ReattRedesTypes);
  }

  public static getDoubleFormTransaction(transaction: SchATransaction | SchBTransaction) {
    const formTransaction = transaction?.children?.filter((child) =>
      [ReattRedesTypes.REATTRIBUTION_TO, ReattRedesTypes.REDESIGNATION_TO].includes(
        (child as SchATransaction | SchBTransaction).reattribution_redesignation_tag as ReattRedesTypes
      )
    )[0];
    formTransaction.children.push(
      transaction?.children?.filter((child) =>
        [ReattRedesTypes.REATTRIBUTION_FROM, ReattRedesTypes.REDESIGNATION_FROM].includes(
          (child as SchATransaction | SchBTransaction).reattribution_redesignation_tag as ReattRedesTypes
        )
      )[0]
    );
    return formTransaction;
  }

  public static overlayTransactionProperties(transaction: SchATransaction | SchBTransaction): Transaction {
    switch (transaction.reattribution_redesignation_tag) {
      case ReattRedesTypes.REATTRIBUTED:
        (transaction as SchATransaction).contribution_purpose_descrip = 'See attribution below.';
        break;

      case ReattRedesTypes.REATTRIBUTION_TO:
        transaction.transactionType.dependentChildTransactionTypes = [
          transaction.transaction_type_identifier as TransactionTypes,
        ];
        transaction.transactionType.title = 'Reattribution';
        transaction.transactionType.subTitle =
          'The portion of an excessive contribution that has been attributed, in writing, to another contributor and signed by both contributors.';
        transaction.transactionType.accordionTitle = 'ENTER DATA';
        transaction.transactionType.accordionSubText =
          'Reattribute a contribution or a portion of it to a different contributor.';
        transaction.transactionType.formTitle = 'Reattribution to';
        transaction.transactionType.contactTitle = 'Contact';
        transaction.transactionType.dateLabel = 'REATTRIBUTION DATE';
        transaction.transactionType.amountLabel = 'REATTRIBUTED AMOUNT';
        transaction.transactionType.footer =
          'The information in this rattribution will automatically create a related receipt. Review the receipt, or continue without reviewing and "Save transactions."';
        transaction.transactionType.schema.properties['memo_code'].const = true;
        transaction.transactionType.generatePurposeDescription = (transaction: SchATransaction): string => {
          if (!transaction.parent_transaction) return '';
          const parentTransaction = transaction.parent_transaction as SchATransaction;
          let name = '';
          if (parentTransaction.contributor_organization_name) {
            name = parentTransaction.contributor_organization_name;
          }
          if (
            parentTransaction.entity_type === ContactTypes.INDIVIDUAL &&
            parentTransaction.contributor_first_name &&
            parentTransaction.contributor_last_name
          ) {
            name = `${parentTransaction.contributor_first_name || ''} ${parentTransaction.contributor_last_name || ''}`;
          }
          return `Reattributed from ${name}`;
        };
        break;

      case ReattRedesTypes.REATTRIBUTION_FROM:
        transaction.transactionType.accordionTitle = 'AUTO-POPULATED';
        transaction.transactionType.accordionSubText =
          'Review contact, receipt, and additional information in the reattribution from section.';
        transaction.transactionType.title = 'Reattribution from';
        transaction.transactionType.contactTitle = 'Contact';
        transaction.transactionType.dateLabel = 'REATTRIBUTION DATE';
        transaction.transactionType.amountLabel = 'REATTRIBUTED AMOUNT';
        transaction.transactionType.schema.properties['memo_code'].const = true;
        transaction.transactionType.inheritedFields = [
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
        ] as TemplateMapKeyType[];
        transaction.transactionType.useParentContact = true;
        transaction.transactionType.generatePurposeDescription = (transaction: SchATransaction): string => {
          if (!transaction.parent_transaction) return '';
          const parentTransaction = transaction.parent_transaction as SchATransaction;
          let name = '';
          if (parentTransaction.contributor_organization_name) {
            name = parentTransaction.contributor_organization_name;
          }
          if (
            parentTransaction.entity_type === ContactTypes.INDIVIDUAL &&
            parentTransaction.contributor_first_name &&
            parentTransaction.contributor_last_name
          ) {
            name = `${parentTransaction.contributor_first_name || ''} ${parentTransaction.contributor_last_name || ''}`;
          }
          return `Reattributed to ${name}`;
        };
        break;
    }

    return transaction;
  }
}

/**
 * New validation rules for the transaction amount of reattribution and redesignation transactions.
 * These rules supplant the original rules for a given transaction.
 * @param transaction
 * @returns
 */
function amountValidator(transaction: SchATransaction | SchBTransaction): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const amount = control.value;

    if (
      (transaction.reattribution_redesignation_tag === ReattRedesTypes.REATTRIBUTION_FROM ||
        transaction.reattribution_redesignation_tag === ReattRedesTypes.REDESIGNATION_FROM) &&
      amount !== null
    ) {
      if (amount >= 0) {
        return { exclusiveMax: { exclusiveMax: 0 } };
      }

      const key = transaction.transactionType.templateMap.amount;
      const parent = transaction.parent_transaction as SchATransaction | SchBTransaction;
      if (parent) {
        const parentValue = parent[key as keyof (SchATransaction | SchBTransaction)] ?? 0;
        if (Math.abs(amount) > Math.abs(parentValue as number)) {
          return {
            max: {
              max: parentValue,
              msgPrefix: 'The absolute value of the amount must be less than or equal to',
            },
          };
        }
      }
    }

    return null;
  };
}

function getName(transaction: SchATransaction | SchBTransaction): string {
  if (transaction.entity_type === ContactTypes.INDIVIDUAL) {
    const firstName = transaction[
      transaction.transactionType.templateMap.first_name as keyof (SchATransaction | SchBTransaction)
    ] as string;
    const lastName = transaction[
      transaction.transactionType.templateMap.last_name as keyof (SchATransaction | SchBTransaction)
    ] as string;
    return `${lastName}, ${firstName}`;
  }

  const orgName = transaction[
    transaction.transactionType.templateMap.organization_name as keyof (SchATransaction | SchBTransaction)
  ] as string;
  return orgName;
}
