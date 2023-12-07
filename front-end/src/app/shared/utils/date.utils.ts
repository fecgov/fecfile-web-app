import { DateTime } from 'luxon';
import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class DateUtils {
  /**
   * For given date, convert it to a string that
   * FEC expects
   * @param {Date} date
   * @returns {string} FEC formatted date string
   */
  public static convertDateToFecFormat(date: Date | null) {
    if (!date) {
      return date;
    }
    return DateTime.fromJSDate(date).toFormat('yyyy-MM-dd');
  }

  /**
   * For given date, convert it to a string mm/dd/yyyy
   * @param {Date} date
   * @returns {string} mm/dd/yyyy formatted date string
   */
  public static convertDateToSlashFormat(date: Date | null | undefined) {
    if (!date) {
      return date;
    }
    return DateTime.fromJSDate(date).toFormat('MM/dd/yyyy');
  }

  /**
   *
   * @param date For given date string YYYYMMDD, return a Date object.
   * @returns {Date}
   */
  public static convertFecFormatToDate(date: string | null): Date | null {
    if (!date) {
      return null;
    }
    return DateTime.fromFormat(date, 'yyyy-MM-dd').toJSDate();
  }

  /**
   * @returns True if all dates are defined and date ranges overlap.  (dates that are the same count as overlapping)
   */
  public static areOverlapping(fromA?: Date, throughA?: Date, fromB?: Date, throughB?: Date): boolean {
    return !!(fromA && throughA && fromB && throughB) && fromA <= throughB && throughA >= fromB;
  }

  public static isWithin(date?: Date, from?: Date, through?: Date): boolean {
    return !!(date && from && through) && from <= date && date <= through;
  }

  public static dateAfter(afterDateControl: AbstractControl<Date | null>): ValidatorFn {
    return (control: AbstractControl<Date | null>): ValidationErrors | null => {

      const afterValue = control.value;
      const beforeValue = afterDateControl.value;
      if (!beforeValue || !afterValue) {
        return null;
      }
      return beforeValue.getTime() >= afterValue.getTime() ? {dateAfter: true} : null;
    }
  }
}
