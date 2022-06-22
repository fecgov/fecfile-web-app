import { DateTime } from 'luxon';

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
}
