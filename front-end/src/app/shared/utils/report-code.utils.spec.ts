import { DateUtils } from './date.utils';
import { getCoverageDates, ReportCodes } from './report-code.utils';

describe('ReportCodeUtils', () => {
  describe('getCoverageDates', () => {
    it('should return correct function for Q1', () => {
      const coverage = getCoverageDates(ReportCodes.Q1, true, 'Q')!;
      expect((coverage.from as Date).getMonth()).toBe(0);
      expect((coverage.from as Date).getDate()).toBe(1);
      expect((coverage.to as Date).getMonth()).toBe(2);
      expect((coverage.to as Date).getDate()).toBe(31);
    });

    it('should return correct function for Q2', () => {
      const coverage = getCoverageDates(ReportCodes.Q2, true, 'Q')!;
      expect((coverage.from as Date).getMonth()).toBe(3);
      expect((coverage.from as Date).getDate()).toBe(1);
      expect((coverage.to as Date).getMonth()).toBe(5);
      expect((coverage.to as Date).getDate()).toBe(30);
    });

    it('should return correct function for Q3', () => {
      const coverage = getCoverageDates(ReportCodes.Q3, true, 'Q')!;
      expect((coverage.from as Date).getMonth()).toBe(6);
      expect((coverage.from as Date).getDate()).toBe(1);
      expect((coverage.to as Date).getMonth()).toBe(8);
      expect((coverage.to as Date).getDate()).toBe(30);
    });

    it('should return correct function for YE when current month is January', () => {
      vi.spyOn(DateUtils, 'isCurrentMonthJanuary').mockReturnValue(true);

      // Test for election year
      let coverage = getCoverageDates(ReportCodes.YE, true, 'Q')!;
      expect(coverage.from).toBeNull();
      expect((coverage.to as Date).getFullYear()).toBe(2023);
      expect((coverage.to as Date).getMonth()).toBe(11);
      expect((coverage.to as Date).getDate()).toBe(31);

      // Test for non-election year with filingFrequency 'Q'
      coverage = getCoverageDates(ReportCodes.YE, false, 'Q')!;
      expect((coverage.from as Date).getFullYear()).toBe(2023);
      expect((coverage.from as Date).getMonth()).toBe(6);
      expect((coverage.from as Date).getDate()).toBe(1);
      expect((coverage.to as Date).getFullYear()).toBe(2023);
      expect((coverage.to as Date).getMonth()).toBe(11);
      expect((coverage.to as Date).getDate()).toBe(31);

      // Test for non-election year with filingFrequency other than 'Q'
      coverage = getCoverageDates(ReportCodes.YE, false, 'M')!;
      expect((coverage.from as Date).getFullYear()).toBe(2023);
      expect((coverage.from as Date).getMonth()).toBe(11);
      expect((coverage.from as Date).getDate()).toBe(1);
      expect((coverage.to as Date).getFullYear()).toBe(2023);
      expect((coverage.to as Date).getMonth()).toBe(11);
      expect((coverage.to as Date).getDate()).toBe(31);
    });

    it('should return correct function for YE when current month is not January', () => {
      vi.spyOn(DateUtils, 'isCurrentMonthJanuary').mockReturnValue(false);

      // Test for election year
      let coverage = getCoverageDates(ReportCodes.YE, true, 'Q')!;
      expect(coverage.from).toBeNull();
      expect((coverage.to as Date).getFullYear()).toBe(2024);
      expect((coverage.to as Date).getMonth()).toBe(11);
      expect((coverage.to as Date).getDate()).toBe(31);

      // Test for non-election year with filingFrequency 'Q'
      coverage = getCoverageDates(ReportCodes.YE, false, 'Q')!;
      expect((coverage.from as Date).getFullYear()).toBe(2024);
      expect((coverage.from as Date).getMonth()).toBe(6);
      expect((coverage.from as Date).getDate()).toBe(1);
      expect((coverage.to as Date).getFullYear()).toBe(2024);
      expect((coverage.to as Date).getMonth()).toBe(11);
      expect((coverage.to as Date).getDate()).toBe(31);

      // Test for non-election year with filingFrequency other than 'Q'
      coverage = getCoverageDates(ReportCodes.YE, false, 'M')!;
      expect((coverage.from as Date).getFullYear()).toBe(2024);
      expect((coverage.from as Date).getMonth()).toBe(11);
      expect((coverage.from as Date).getDate()).toBe(1);
      expect((coverage.to as Date).getFullYear()).toBe(2024);
      expect((coverage.to as Date).getMonth()).toBe(11);
      expect((coverage.to as Date).getDate()).toBe(31);
    });

    it('should return correct function for M2', () => {
      const coverage = getCoverageDates(ReportCodes.M2, true, 'M')!;
      expect((coverage.from as Date).getMonth()).toBe(0);
      expect((coverage.from as Date).getDate()).toBe(1);
      expect((coverage.to as Date).getMonth()).toBe(0);
      expect((coverage.to as Date).getDate()).toBe(31);
    });

    it('should return correct function for M3', () => {
      let coverage = getCoverageDates(ReportCodes.M3, true, 'M')!;
      expect((coverage.from as Date).getMonth()).toBe(1);
      expect((coverage.from as Date).getDate()).toBe(1);
      expect((coverage.to as Date).getMonth()).toBe(1);
      expect((coverage.to as Date).getDate()).toBe(29);

      coverage = getCoverageDates(ReportCodes.M3, true, 'M')!;
      expect((coverage.to as Date).getDate()).toBe(28);
    });

    it('should return correct function for M4', () => {
      const coverage = getCoverageDates(ReportCodes.M4, true, 'M')!;
      expect((coverage.from as Date).getMonth()).toBe(2);
      expect((coverage.from as Date).getDate()).toBe(1);
      expect((coverage.to as Date).getMonth()).toBe(2);
      expect((coverage.to as Date).getDate()).toBe(31);
    });

    it('should return correct function for M5', () => {
      const coverage = getCoverageDates(ReportCodes.M5, true, 'M')!;
      expect((coverage.from as Date).getMonth()).toBe(3);
      expect((coverage.from as Date).getDate()).toBe(1);
      expect((coverage.to as Date).getMonth()).toBe(3);
      expect((coverage.to as Date).getDate()).toBe(30);
    });

    it('should return correct function for M6', () => {
      const coverage = getCoverageDates(ReportCodes.M6, true, 'M')!;
      expect((coverage.from as Date).getMonth()).toBe(4);
      expect((coverage.from as Date).getDate()).toBe(1);
      expect((coverage.to as Date).getMonth()).toBe(4);
      expect((coverage.to as Date).getDate()).toBe(31);
    });

    it('should return correct function for M7', () => {
      const coverage = getCoverageDates(ReportCodes.M7, true, 'M')!;
      expect((coverage.from as Date).getMonth()).toBe(5);
      expect((coverage.from as Date).getDate()).toBe(1);
      expect((coverage.to as Date).getMonth()).toBe(5);
      expect((coverage.to as Date).getDate()).toBe(30);
    });

    it('should return correct function for M8', () => {
      const coverage = getCoverageDates(ReportCodes.M8, true, 'M')!;
      expect((coverage.from as Date).getMonth()).toBe(6);
      expect((coverage.from as Date).getDate()).toBe(1);
      expect((coverage.to as Date).getMonth()).toBe(6);
      expect((coverage.to as Date).getDate()).toBe(31);
    });

    it('should return correct function for M9', () => {
      const coverage = getCoverageDates(ReportCodes.M9, true, 'M')!;
      expect((coverage.from as Date).getMonth()).toBe(7);
      expect((coverage.from as Date).getDate()).toBe(1);
      expect((coverage.to as Date).getMonth()).toBe(7);
      expect((coverage.to as Date).getDate()).toBe(31);
    });

    it('should return correct function for M10', () => {
      const coverage = getCoverageDates(ReportCodes.M10, true, 'M')!;
      expect((coverage.from as Date).getMonth()).toBe(8);
      expect((coverage.from as Date).getDate()).toBe(1);
      expect((coverage.to as Date).getMonth()).toBe(8);
      expect((coverage.to as Date).getDate()).toBe(30);
    });

    it('should return correct function for M11', () => {
      const coverage = getCoverageDates(ReportCodes.M11, true, 'M')!;
      expect((coverage.from as Date).getMonth()).toBe(9);
      expect((coverage.from as Date).getDate()).toBe(1);
      expect((coverage.to as Date).getMonth()).toBe(9);
      expect((coverage.to as Date).getDate()).toBe(31);
    });

    it('should return correct function for M12', () => {
      const coverage = getCoverageDates(ReportCodes.M12, true, 'M')!;
      expect((coverage.from as Date).getMonth()).toBe(10);
      expect((coverage.from as Date).getDate()).toBe(1);
      expect((coverage.to as Date).getMonth()).toBe(10);
      expect((coverage.to as Date).getDate()).toBe(30);
    });

    it('should return undefined for all others', () => {
      let result = getCoverageDates(ReportCodes.TER, true, 'M');
      expect(result).toBeUndefined();

      result = getCoverageDates(ReportCodes['12G'], true, 'M');
      expect(result).toBeUndefined();

      result = getCoverageDates(ReportCodes['12P'], true, 'M');
      expect(result).toBeUndefined();

      result = getCoverageDates(ReportCodes['12R'], true, 'M');
      expect(result).toBeUndefined();

      result = getCoverageDates(ReportCodes['12S'], true, 'M');
      expect(result).toBeUndefined();

      result = getCoverageDates(ReportCodes['12C'], true, 'M');
      expect(result).toBeUndefined();

      result = getCoverageDates(ReportCodes['30G'], true, 'M');
      expect(result).toBeUndefined();

      result = getCoverageDates(ReportCodes['30R'], true, 'M');
      expect(result).toBeUndefined();

      result = getCoverageDates(ReportCodes['30S'], true, 'M');
      expect(result).toBeUndefined();
    });
  });
});
