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
    return DateTime.fromJSDate(date).toFormat('yyyyMMdd');
  }
}
