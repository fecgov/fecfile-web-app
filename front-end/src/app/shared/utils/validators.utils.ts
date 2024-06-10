import { AbstractControl, AsyncValidator, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { F3xCoverageDates } from '../models/form-3x.model';
import { DateUtils } from './date.utils';
import { FecDatePipe } from '../pipes/fec-date.pipe';
import * as _ from 'lodash';
import { SchATransaction } from '../models/scha-transaction.model';
import { SchBTransaction } from '../models/schb-transaction.model';
import { Injectable } from '@angular/core';
import { CommitteeMemberService } from '../services/committee-member.service';

export function emailValidator(control: AbstractControl): ValidationErrors | null {
  const email = control.value;
  const matches = email?.match(/^\S+@\S+\.\S{2,}$/g);

  return !!email && !matches
    ? {
        email: 'invalid',
      }
    : null;
}

export const committeeIdValidator = Validators.pattern('^[Cc]\\d{8}$');

export const percentageValidator = Validators.pattern('^\\d+(\\.\\d{1,5})?%$');

export const passwordValidator = Validators.compose([
  Validators.required,
  Validators.minLength(8),
  Validators.maxLength(16),
  Validators.pattern('.*[A-Z].*'),
  Validators.pattern('.*[a-z].*'),
  Validators.pattern('.*[0-9].*'),
  Validators.pattern('.*[!@#$%&*()].*'),
]) as ValidatorFn;

/**
 * buildGuaranteeUniqueValuesValidator
 *
 * returns a Validator Function that returns an error [key]: 'not-unique'
 * if the value of the field control (primaryControlName) matches the value
 * from any other control name provided.
 *
 * @param form FormGroup
 * @param primaryControlName string
 * @param otherControlNames string[]
 * @param key string (Defaults to 'error')
 * @returns ValidatorFn => {}: ValidationErrors | null
 */
export function buildGuaranteeUniqueValuesValidator(
  form: FormGroup,
  primaryControlName: string,
  otherControlNames: string[],
  key = 'error',
): ValidatorFn {
  return (): ValidationErrors | null => {
    const primaryValue = form.get(primaryControlName)?.value || '';
    const otherValues = otherControlNames.map((controlName) => {
      return (form.get(controlName)?.value as string) || '';
    });

    return primaryValue && otherValues.includes(primaryValue)
      ? {
          [key]: 'not-unique',
        }
      : null;
  };
}

export function buildNonOverlappingCoverageValidator(existingCoverage: F3xCoverageDates[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const fromControl = control.get('coverage_from_date');
    const throughControl = control.get('coverage_through_date');
    const surrounding = findSurrounding(fromControl?.value, throughControl?.value, existingCoverage);
    let fromError = validateDateWithinCoverage(existingCoverage, fromControl);
    let throughError = validateDateWithinCoverage(existingCoverage, throughControl);
    if (surrounding) {
      fromError = throughError = getCoverageOverlapError(surrounding);
    }
    fromControl?.setErrors(getErrors(fromControl.errors, fromError));
    throughControl?.setErrors(getErrors(throughControl.errors, throughError));
    fromControl?.markAsTouched();
    throughControl?.markAsTouched();
    return null;
  };
}

function validateDateWithinCoverage(
  existingCoverage: F3xCoverageDates[],
  control: AbstractControl | null,
): ValidationErrors | null {
  return existingCoverage.reduce((error: ValidationErrors | null, coverage) => {
    if (error) return error;
    return DateUtils.isWithin(control?.value, coverage.coverage_from_date, coverage.coverage_through_date)
      ? getCoverageOverlapError(coverage)
      : null;
  }, null);
}

function getErrors(errors: ValidationErrors | null, newError: ValidationErrors | null): ValidationErrors | null {
  const otherErrors = !_.isEmpty(_.omit(errors, 'invaliddate')) ? _.omit(errors, 'invaliddate') : null;
  return otherErrors || newError ? { ...otherErrors, ...newError } : null;
}

function findSurrounding(
  from: Date,
  through: Date,
  existingCoverage: F3xCoverageDates[],
): F3xCoverageDates | undefined {
  return existingCoverage.find((coverage) => {
    const coverageFrom = coverage.coverage_from_date;
    const coverageThrough = coverage.coverage_through_date;
    return coverageFrom && coverageThrough && from <= coverageFrom && through >= coverageThrough;
  });
}

function getCoverageOverlapError(collision: F3xCoverageDates): ValidationErrors {
  const fecDatePipe = new FecDatePipe();
  const message =
    `You have entered coverage dates that overlap ` +
    `the coverage dates of the following report: ${collision.report_code_label} ` +
    ` ${fecDatePipe.transform(collision.coverage_from_date)} -` +
    ` ${fecDatePipe.transform(collision.coverage_through_date)}`;
  return { invaliddate: { msg: message } };
}

export function buildCorrespondingForm3XValidator(
  dateControl: AbstractControl,
  date2Control: AbstractControl,
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!dateControl.value && !date2Control.value) {
      return {
        noDateProvided: true,
      };
    } else if (!control.value) {
      return {
        noCorrespondingForm3X: true,
      };
    }

    return null;
  };
}

export function buildWithinReportDatesValidator(coverage_from_date?: Date, coverage_through_date?: Date): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const date = control.value;

    if (!DateUtils.isWithin(date, coverage_from_date, coverage_through_date)) {
      const message = `This date must fall within the coverage dates of ${DateUtils.convertDateToSlashFormat(
        coverage_from_date,
      )} - ${DateUtils.convertDateToSlashFormat(coverage_through_date)} for this report.`;
      return { invaliddate: { msg: message } };
    }

    return null;
  };
}

export function buildAfterDateValidator(otherDateControl: AbstractControl<Date | null>): ValidatorFn {
  return (control: AbstractControl<Date | null>): ValidationErrors | null => {
    const controlDate = control.value;
    const otherDate = otherDateControl.value;
    if (!otherDate || !controlDate) {
      return null;
    }
    return otherDate.getTime() >= controlDate.getTime()
      ? { isAfter: `${controlDate} must be after ${otherDate}` }
      : null;
  };
}

export function buildPrefixRequiredValidator(prefix: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const failed = control.value.length <= prefix.length;
    return failed ? { required: true } : null;
  };
}

/**
 * New validation rules for the transaction amount of reattribution from and redesignation from transactions.
 * These rules supplant the original rules for a given transaction.
 * @param transaction
 * @param mustBeNegative
 * @returns
 */
export function buildReattRedesTransactionValidator(
  transaction: SchATransaction | SchBTransaction,
  mustBeNegative = false,
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const amount = control.value;

    if (amount !== null) {
      if (mustBeNegative && amount >= 0) {
        return { exclusiveMax: { exclusiveMax: 0 } };
      }
      if (!mustBeNegative && amount < 0) {
        return { exclusiveMin: { exclusiveMin: 0 } };
      }

      const amountKey = transaction.transactionType.templateMap.amount;
      const originalAmount =
        ((transaction.reatt_redes as SchATransaction | SchBTransaction)[
          amountKey as keyof (SchATransaction | SchBTransaction)
        ] as number) ?? 0;
      const reattRedesTotal = (transaction.reatt_redes as SchATransaction | SchBTransaction)?.reatt_redes_total ?? 0;
      let limit = originalAmount - reattRedesTotal;
      if (transaction.id) limit += +(transaction[amountKey as keyof (SchATransaction | SchBTransaction)] as number); // If editing, add value back into limit restriction.
      if (Math.abs(amount) > Math.abs(limit)) {
        return {
          max: {
            max: limit,
            msgPrefix: 'The absolute value of the amount must be less than or equal to',
          },
        };
      }
    }

    return null;
  };
}

@Injectable({ providedIn: 'root' })
export class CommitteeMemberEmailValidator implements AsyncValidator {
  constructor(protected committeeMemberService: CommitteeMemberService) {}

  async validate(control: AbstractControl): Promise<ValidationErrors | null> {
    if (control.value) {
      const existing_members = await this.committeeMemberService.getMembers();
      const emails = existing_members.map((member) => {
        return member.email.toLowerCase();
      });

      const newEmail = control.value?.toLowerCase();
      if (emails.includes(newEmail)) {
        return {
          email: 'taken-in-committee',
        };
      }
    }
    return null;
  }
}
