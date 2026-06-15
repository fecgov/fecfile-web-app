import { DateUtils } from './date.utils';
import { getCoverageDates, ReportCodes } from './report-code.utils';

describe('ReportCodeUtils', () => {
  describe('getCoverageDates', () => {
    it('should return correct function for Q1', () => {
      const [startDate, endDate] = getCoverageDates(ReportCodes.Q1, 2024, true, 'Q')!;
      expect(startDate?.getMonth()).toBe(0);
      expect(startDate?.getDate()).toBe(1);
      expect(endDate.getMonth()).toBe(2);
      expect(endDate.getDate()).toBe(31);
    });

    it('should return correct function for Q2', () => {
      const [startDate, endDate] = getCoverageDates(ReportCodes.Q2, 2024, true, 'Q')!;
      expect(startDate?.getMonth()).toBe(3);
      expect(startDate?.getDate()).toBe(1);
      expect(endDate.getMonth()).toBe(5);
      expect(endDate.getDate()).toBe(30);
    });

    it('should return correct function for Q3', () => {
      const [startDate, endDate] = getCoverageDates(ReportCodes.Q3, 2024, true, 'Q')!;
      expect(startDate?.getMonth()).toBe(6);
      expect(startDate?.getDate()).toBe(1);
      expect(endDate.getMonth()).toBe(8);
      expect(endDate.getDate()).toBe(30);
    });

    it('should return correct function for YE when current month is January', () => {
      vi.spyOn(DateUtils, 'isCurrentMonthJanuary').mockReturnValue(true);

      // Test for election year
      let [startDate, endDate] = getCoverageDates(ReportCodes.YE, 2024, true, 'Q')!;
      expect(startDate).toBe(undefined);
      expect(endDate.getFullYear()).toBe(2023);
      expect(endDate.getMonth()).toBe(11);
      expect(endDate.getDate()).toBe(31);

      // Test for non-election year with filingFrequency 'Q'
      [startDate, endDate] = getCoverageDates(ReportCodes.YE, 2024, false, 'Q')!;
      expect(startDate?.getFullYear()).toBe(2023);
      expect(startDate?.getMonth()).toBe(6);
      expect(startDate?.getDate()).toBe(1);
      expect(endDate.getFullYear()).toBe(2023);
      expect(endDate.getMonth()).toBe(11);
      expect(endDate.getDate()).toBe(31);

      // Test for non-election year with filingFrequency other than 'Q'
      [startDate, endDate] = getCoverageDates(ReportCodes.YE, 2024, false, 'M')!;
      expect(startDate?.getFullYear()).toBe(2023);
      expect(startDate?.getMonth()).toBe(11);
      expect(startDate?.getDate()).toBe(1);
      expect(endDate.getFullYear()).toBe(2023);
      expect(endDate.getMonth()).toBe(11);
      expect(endDate.getDate()).toBe(31);
    });

    it('should return correct function for YE when current month is not January', () => {
      vi.spyOn(DateUtils, 'isCurrentMonthJanuary').mockReturnValue(false);

      // Test for election year
      let [startDate, endDate] = getCoverageDates(ReportCodes.YE, 2024, true, 'Q')!;
      expect(startDate).toBe(undefined);
      expect(endDate.getFullYear()).toBe(2024);
      expect(endDate.getMonth()).toBe(11);
      expect(endDate.getDate()).toBe(31);

      // Test for non-election year with filingFrequency 'Q'
      [startDate, endDate] = getCoverageDates(ReportCodes.YE, 2024, false, 'Q')!;
      expect(startDate?.getFullYear()).toBe(2024);
      expect(startDate?.getMonth()).toBe(6);
      expect(startDate?.getDate()).toBe(1);
      expect(endDate.getFullYear()).toBe(2024);
      expect(endDate.getMonth()).toBe(11);
      expect(endDate.getDate()).toBe(31);

      // Test for non-election year with filingFrequency other than 'Q'
      [startDate, endDate] = getCoverageDates(ReportCodes.YE, 2024, false, 'M')!;
      expect(startDate?.getFullYear()).toBe(2024);
      expect(startDate?.getMonth()).toBe(11);
      expect(startDate?.getDate()).toBe(1);
      expect(endDate.getFullYear()).toBe(2024);
      expect(endDate.getMonth()).toBe(11);
      expect(endDate.getDate()).toBe(31);
    });

    it('should return correct function for M2', () => {
      const [startDate, endDate] = getCoverageDates(ReportCodes.M2, 2024, true, 'M')!;
      expect(startDate?.getMonth()).toBe(0);
      expect(startDate?.getDate()).toBe(1);
      expect(endDate.getMonth()).toBe(0);
      expect(endDate.getDate()).toBe(31);
    });

    it('should return correct function for M3', () => {
      const [startDate, endDate] = getCoverageDates(ReportCodes.M3, 2024, true, 'M')!;
      expect(startDate?.getMonth()).toBe(1);
      expect(startDate?.getDate()).toBe(1);
      expect(endDate.getMonth()).toBe(1);
      expect(endDate.getDate()).toBe(29);

      const [, endDate1] = getCoverageDates(ReportCodes.M3, 2025, true, 'M')!;
      expect(endDate1.getDate()).toBe(28);
    });

    it('should return correct function for M4', () => {
      const [startDate, endDate] = getCoverageDates(ReportCodes.M4, 2024, true, 'M')!;
      expect(startDate?.getMonth()).toBe(2);
      expect(startDate?.getDate()).toBe(1);
      expect(endDate.getMonth()).toBe(2);
      expect(endDate.getDate()).toBe(31);
    });

    it('should return correct function for M5', () => {
      const [startDate, endDate] = getCoverageDates(ReportCodes.M5, 2024, true, 'M')!;
      expect(startDate?.getMonth()).toBe(3);
      expect(startDate?.getDate()).toBe(1);
      expect(endDate.getMonth()).toBe(3);
      expect(endDate.getDate()).toBe(30);
    });

    it('should return correct function for M6', () => {
      const [startDate, endDate] = getCoverageDates(ReportCodes.M6, 2024, true, 'M')!;
      expect(startDate?.getMonth()).toBe(4);
      expect(startDate?.getDate()).toBe(1);
      expect(endDate.getMonth()).toBe(4);
      expect(endDate.getDate()).toBe(31);
    });

    it('should return correct function for M7', () => {
      const [startDate, endDate] = getCoverageDates(ReportCodes.M7, 2024, true, 'M')!;
      expect(startDate?.getMonth()).toBe(5);
      expect(startDate?.getDate()).toBe(1);
      expect(endDate.getMonth()).toBe(5);
      expect(endDate.getDate()).toBe(30);
    });

    it('should return correct function for M8', () => {
      const [startDate, endDate] = getCoverageDates(ReportCodes.M8, 2024, true, 'M')!;
      expect(startDate?.getMonth()).toBe(6);
      expect(startDate?.getDate()).toBe(1);
      expect(endDate.getMonth()).toBe(6);
      expect(endDate.getDate()).toBe(31);
    });

    it('should return correct function for M9', () => {
      const [startDate, endDate] = getCoverageDates(ReportCodes.M9, 2024, true, 'M')!;
      expect(startDate?.getMonth()).toBe(7);
      expect(startDate?.getDate()).toBe(1);
      expect(endDate.getMonth()).toBe(7);
      expect(endDate.getDate()).toBe(31);
    });

    it('should return correct function for M10', () => {
      const [startDate, endDate] = getCoverageDates(ReportCodes.M10, 2024, true, 'M')!;
      expect(startDate?.getMonth()).toBe(8);
      expect(startDate?.getDate()).toBe(1);
      expect(endDate.getMonth()).toBe(8);
      expect(endDate.getDate()).toBe(30);
    });

    it('should return correct function for M11', () => {
      const [startDate, endDate] = getCoverageDates(ReportCodes.M11, 2024, true, 'M')!;
      expect(startDate?.getMonth()).toBe(9);
      expect(startDate?.getDate()).toBe(1);
      expect(endDate.getMonth()).toBe(9);
      expect(endDate.getDate()).toBe(31);
    });

    it('should return correct function for M12', () => {
      const [startDate, endDate] = getCoverageDates(ReportCodes.M12, 2024, true, 'M')!;
      expect(startDate?.getMonth()).toBe(10);
      expect(startDate?.getDate()).toBe(1);
      expect(endDate.getMonth()).toBe(10);
      expect(endDate.getDate()).toBe(30);
    });

    it('should return undefined for all others', () => {
      let result = getCoverageDates(ReportCodes.TER, 2024, true, 'M');
      expect(result).toBeUndefined();

      result = getCoverageDates(ReportCodes['12G'], 2024, true, 'M');
      expect(result).toBeUndefined();

      result = getCoverageDates(ReportCodes['12P'], 2024, true, 'M');
      expect(result).toBeUndefined();

      result = getCoverageDates(ReportCodes['12R'], 2024, true, 'M');
      expect(result).toBeUndefined();

      result = getCoverageDates(ReportCodes['12S'], 2024, true, 'M');
      expect(result).toBeUndefined();

      result = getCoverageDates(ReportCodes['12C'], 2024, true, 'M');
      expect(result).toBeUndefined();

      result = getCoverageDates(ReportCodes['30G'], 2024, true, 'M');
      expect(result).toBeUndefined();

      result = getCoverageDates(ReportCodes['30R'], 2024, true, 'M');
      expect(result).toBeUndefined();

      result = getCoverageDates(ReportCodes['30S'], 2024, true, 'M');
      expect(result).toBeUndefined();
    });
  });
});
