import { FormGroup, AbstractControl, Validators, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Form3X } from 'app/shared/models/form-3x.model';
import { DateUtils } from './date.utils';
import { SchATransaction } from '../models/scha-transaction.model';
import { SchBTransaction } from '../models/schb-transaction.model';

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
    transaction: SchATransaction & SchBTransaction,
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
        ?.setValue(`Reattribution to ${getName(transaction.parent_transaction as SchATransaction & SchBTransaction)}`);
    }
    if (transaction.reattribution_redesignation_tag === ReattRedesTypes.REATTRIBUTION_TO) {
      form
        .get(pdKey)
        ?.setValue(
          `Reattribution from ${getName(transaction.parent_transaction as SchATransaction & SchBTransaction)}`
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
    transaction: SchATransaction & SchBTransaction,
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
}

/**
 * New validation rules for the transaction amount of reattribution and redesignation transactions.
 * These rules supplant the original rules for a given transaction.
 * @param transaction
 * @returns
 */
function amountValidator(transaction: SchATransaction & SchBTransaction): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const amount = control.value;

    if (transaction.reattribution_redesignation_tag === ReattRedesTypes.REATTRIBUTION_FROM && amount !== null) {
      if (amount >= 0) {
        return { exclusiveMax: { exclusiveMax: 0 } };
      }

      const key = transaction.transactionType.templateMap.amount;
      const parent = transaction.parent_transaction as SchATransaction & SchBTransaction;
      if (parent) {
        const parentValue = (parent[key as keyof (SchATransaction & SchBTransaction)] as number) ?? 0;
        if (Math.abs(amount) > Math.abs(parentValue)) {
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

function getName(transaction: SchATransaction & SchBTransaction): string {
  const orgName = transaction[
    transaction.transactionType.templateMap.organization_name as keyof (SchATransaction & SchBTransaction)
  ] as string;
  if (orgName) {
    return orgName;
  }
  const firstName = transaction[
    transaction.transactionType.templateMap.first_name as keyof (SchATransaction & SchBTransaction)
  ] as string;
  const lastName = transaction[
    transaction.transactionType.templateMap.last_name as keyof (SchATransaction & SchBTransaction)
  ] as string;
  return `${lastName}, ${firstName}`;
}
