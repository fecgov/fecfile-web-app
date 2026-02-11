export class DateUtils {
  /**
   * For given date, convert it to a string that
   * FEC expects
   * @param {Date} date
   * @returns {string} FEC formatted date string
   */
  public static convertDateToFecFormat(date: Date | null): string {
    if (!date) {
      return '';
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  /**
   * For given date, convert it to a string mm/dd/yyyy
   * @param {Date} date
   * @returns {string} mm/dd/yyyy formatted date string
   */
  public static convertDateToSlashFormat(date: Date | null | undefined): string {
    if (!date) {
      return '';
    }
    return new Intl.DateTimeFormat('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    }).format(date);
  }

  /**
   *
   * @param date For given date string YYYYMMDD, return a Date object.
   * @returns {Date}
   */
  public static convertFecFormatToDate(dateStr: string | null): Date | null {
    if (!dateStr) return null;
    const parts = dateStr.split('-');
    if (parts.length !== 3) return null;

    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);

    const date = new Date(year, month, day);
    return isNaN(date.getTime()) ? null : date;
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

  public static isCurrentMonthJanuary(): boolean {
    const currentMonth = new Date().getMonth();
    return currentMonth === 0;
  }

  public static parseDate(dateString: string): Date | null {
    if (!dateString) return null;
    const date = new Date(dateString);
    // Check if the date is valid
    return isNaN(date.getTime()) ? null : date;
  }
}
