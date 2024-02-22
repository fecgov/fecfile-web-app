import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { F3xCoverageDates } from '../models/form-3x.model';
import { DateUtils } from '../utils/date.utils';
import { getReportCodeLabel } from '../utils/report-code.utils';
import { FecDatePipe } from '../pipes/fec-date.pipe';
import * as _ from 'lodash';

export function buildEmailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return checkInvalidEmail(control?.value)
      ? {
          email: 'invalid',
        }
      : null;
  };
}

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

export function checkInvalidEmail(email: string): boolean {
  const matches = email?.match(/^\S+@\S+\.\S{2,}/g);
  if (!email || email.length == 0) return false; //An empty email should be caught by the required validator

  return matches === null || matches.length == 0;
}

export function existingCoverageValidator(existingCoverage: F3xCoverageDates[]): ValidatorFn {
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
    `the coverage dates of the following report: ${getReportCodeLabel(collision.report_code)} ` +
    ` ${fecDatePipe.transform(collision.coverage_from_date)} -` +
    ` ${fecDatePipe.transform(collision.coverage_through_date)}`;
  return { invaliddate: { msg: message } };
}

export function dateWithinReportRange(coverage_from_date?: Date, coverage_through_date?: Date): ValidatorFn {
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

export const percentageValidator = Validators.pattern('^\\d+(\\.\\d{1,5})?%$') as ValidatorFn;

export function dateIsAfterValidator(otherDateControl: AbstractControl<Date | null>): ValidatorFn {
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
