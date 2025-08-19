import { DateUtils } from './date.utils';
import { getCoverageDatesFunction, ReportCodes } from './report-code.utils';

describe('ReportCodeUtils', () => {
  describe('getCoverageDatesFunction', () => {
    it('should return correct function for Q1', () => {
      const result = getCoverageDatesFunction(ReportCodes.Q1);
      expect(typeof result).toBe('function');
      if (result) {
        const [startDate, endDate] = result(2024, true, 'Q');
        expect(startDate.getMonth()).toBe(0);
        expect(startDate.getDate()).toBe(1);
        expect(endDate.getMonth()).toBe(2);
        expect(endDate.getDate()).toBe(31);
      }
    });

    it('should return correct function for Q2', () => {
      const result = getCoverageDatesFunction(ReportCodes.Q2);
      expect(typeof result).toBe('function');
      if (result) {
        const [startDate, endDate] = result(2024, true, 'Q');
        expect(startDate.getMonth()).toBe(3);
        expect(startDate.getDate()).toBe(1);
        expect(endDate.getMonth()).toBe(5);
        expect(endDate.getDate()).toBe(30);
      }
    });

    it('should return correct function for Q3', () => {
      const result = getCoverageDatesFunction(ReportCodes.Q3);
      expect(typeof result).toBe('function');
      if (result) {
        const [startDate, endDate] = result(2024, true, 'Q');
        expect(startDate.getMonth()).toBe(6);
        expect(startDate.getDate()).toBe(1);
        expect(endDate.getMonth()).toBe(8);
        expect(endDate.getDate()).toBe(30);
      }
    });

    it('should return correct function for YE when current month is January', () => {
      const result = getCoverageDatesFunction(ReportCodes.YE);
      if (result) {
        expect(typeof result).toBe('function');
        spyOn(DateUtils, 'isCurrentMonthJanuary').and.returnValue(true);

        // Test for election year
        let [startDate, endDate] = result(2024, true, 'Q');
        expect(startDate.getFullYear()).toBe(2023);
        expect(startDate.getMonth()).toBe(9);
        expect(startDate.getDate()).toBe(1);
        expect(endDate.getFullYear()).toBe(2023);
        expect(endDate.getMonth()).toBe(11);
        expect(endDate.getDate()).toBe(31);

        // Test for non-election year with filingFrequency 'Q'
        [startDate, endDate] = result(2024, false, 'Q');
        expect(startDate.getFullYear()).toBe(2023);
        expect(startDate.getMonth()).toBe(6);
        expect(startDate.getDate()).toBe(1);
        expect(endDate.getFullYear()).toBe(2023);
        expect(endDate.getMonth()).toBe(11);
        expect(endDate.getDate()).toBe(31);

        // Test for non-election year with filingFrequency other than 'Q'
        [startDate, endDate] = result(2024, false, 'M');
        expect(startDate.getFullYear()).toBe(2023);
        expect(startDate.getMonth()).toBe(11);
        expect(startDate.getDate()).toBe(1);
        expect(endDate.getFullYear()).toBe(2023);
        expect(endDate.getMonth()).toBe(11);
        expect(endDate.getDate()).toBe(31);
      }
    });

    it('should return correct function for YE when current month is not January', () => {
      const result = getCoverageDatesFunction(ReportCodes.YE);
      if (result) {
        expect(typeof result).toBe('function');
        spyOn(DateUtils, 'isCurrentMonthJanuary').and.returnValue(false);

        // Test for election year
        let [startDate, endDate] = result(2024, true, 'Q');
        expect(startDate.getFullYear()).toBe(2024);
        expect(startDate.getMonth()).toBe(9);
        expect(startDate.getDate()).toBe(1);
        expect(endDate.getFullYear()).toBe(2024);
        expect(endDate.getMonth()).toBe(11);
        expect(endDate.getDate()).toBe(31);

        // Test for non-election year with filingFrequency 'Q'
        [startDate, endDate] = result(2024, false, 'Q');
        expect(startDate.getFullYear()).toBe(2024);
        expect(startDate.getMonth()).toBe(6);
        expect(startDate.getDate()).toBe(1);
        expect(endDate.getFullYear()).toBe(2024);
        expect(endDate.getMonth()).toBe(11);
        expect(endDate.getDate()).toBe(31);

        // Test for non-election year with filingFrequency other than 'Q'
        [startDate, endDate] = result(2024, false, 'M');
        expect(startDate.getFullYear()).toBe(2024);
        expect(startDate.getMonth()).toBe(11);
        expect(startDate.getDate()).toBe(1);
        expect(endDate.getFullYear()).toBe(2024);
        expect(endDate.getMonth()).toBe(11);
        expect(endDate.getDate()).toBe(31);
      }
    });

    it('should return correct function for M2', () => {
      const result = getCoverageDatesFunction(ReportCodes.M2);
      expect(typeof result).toBe('function');
      if (result) {
        const [startDate, endDate] = result(2024, true, 'M');
        expect(startDate.getMonth()).toBe(0);
        expect(startDate.getDate()).toBe(1);
        expect(endDate.getMonth()).toBe(0);
        expect(endDate.getDate()).toBe(31);
      }
    });

    it('should return correct function for M3', () => {
      const result = getCoverageDatesFunction(ReportCodes.M3);
      expect(typeof result).toBe('function');
      if (result) {
        let [startDate, endDate] = result(2024, true, 'M');
        expect(startDate.getMonth()).toBe(1);
        expect(startDate.getDate()).toBe(1);
        expect(endDate.getMonth()).toBe(1);
        expect(endDate.getDate()).toBe(29);

        [startDate, endDate] = result(2025, true, 'M');
        expect(endDate.getDate()).toBe(28);
      }
    });

    it('should return correct function for M4', () => {
      const result = getCoverageDatesFunction(ReportCodes.M4);
      expect(typeof result).toBe('function');
      if (result) {
        const [startDate, endDate] = result(2024, true, 'M');
        expect(startDate.getMonth()).toBe(2);
        expect(startDate.getDate()).toBe(1);
        expect(endDate.getMonth()).toBe(2);
        expect(endDate.getDate()).toBe(31);
      }
    });

    it('should return correct function for M5', () => {
      const result = getCoverageDatesFunction(ReportCodes.M5);
      expect(typeof result).toBe('function');
      if (result) {
        const [startDate, endDate] = result(2024, true, 'M');
        expect(startDate.getMonth()).toBe(3);
        expect(startDate.getDate()).toBe(1);
        expect(endDate.getMonth()).toBe(3);
        expect(endDate.getDate()).toBe(30);
      }
    });

    it('should return correct function for M6', () => {
      const result = getCoverageDatesFunction(ReportCodes.M6);
      expect(typeof result).toBe('function');
      if (result) {
        const [startDate, endDate] = result(2024, true, 'M');
        expect(startDate.getMonth()).toBe(4);
        expect(startDate.getDate()).toBe(1);
        expect(endDate.getMonth()).toBe(4);
        expect(endDate.getDate()).toBe(31);
      }
    });

    it('should return correct function for M7', () => {
      const result = getCoverageDatesFunction(ReportCodes.M7);
      expect(typeof result).toBe('function');
      if (result) {
        const [startDate, endDate] = result(2024, true, 'M');
        expect(startDate.getMonth()).toBe(5);
        expect(startDate.getDate()).toBe(1);
        expect(endDate.getMonth()).toBe(5);
        expect(endDate.getDate()).toBe(30);
      }
    });

    it('should return correct function for M8', () => {
      const result = getCoverageDatesFunction(ReportCodes.M8);
      expect(typeof result).toBe('function');
      if (result) {
        const [startDate, endDate] = result(2024, true, 'M');
        expect(startDate.getMonth()).toBe(6);
        expect(startDate.getDate()).toBe(1);
        expect(endDate.getMonth()).toBe(6);
        expect(endDate.getDate()).toBe(31);
      }
    });

    it('should return correct function for M9', () => {
      const result = getCoverageDatesFunction(ReportCodes.M9);
      expect(typeof result).toBe('function');
      if (result) {
        const [startDate, endDate] = result(2024, true, 'M');
        expect(startDate.getMonth()).toBe(7);
        expect(startDate.getDate()).toBe(1);
        expect(endDate.getMonth()).toBe(7);
        expect(endDate.getDate()).toBe(31);
      }
    });

    it('should return correct function for M10', () => {
      const result = getCoverageDatesFunction(ReportCodes.M10);
      expect(typeof result).toBe('function');
      if (result) {
        const [startDate, endDate] = result(2024, true, 'M');
        expect(startDate.getMonth()).toBe(8);
        expect(startDate.getDate()).toBe(1);
        expect(endDate.getMonth()).toBe(8);
        expect(endDate.getDate()).toBe(30);
      }
    });

    it('should return correct function for M11', () => {
      const result = getCoverageDatesFunction(ReportCodes.M11);
      expect(typeof result).toBe('function');
      if (result) {
        const [startDate, endDate] = result(2024, true, 'M');
        expect(startDate.getMonth()).toBe(9);
        expect(startDate.getDate()).toBe(1);
        expect(endDate.getMonth()).toBe(9);
        expect(endDate.getDate()).toBe(31);
      }
    });

    it('should return correct function for M12', () => {
      const result = getCoverageDatesFunction(ReportCodes.M12);
      expect(typeof result).toBe('function');
      if (result) {
        const [startDate, endDate] = result(2024, true, 'M');
        expect(startDate.getMonth()).toBe(10);
        expect(startDate.getDate()).toBe(1);
        expect(endDate.getMonth()).toBe(10);
        expect(endDate.getDate()).toBe(30);
      }
    });

    it('should return undefined for all others', () => {
      let result = getCoverageDatesFunction(ReportCodes.TER);
      expect(result).toBeUndefined();

      result = getCoverageDatesFunction(ReportCodes.TwelveG);
      expect(result).toBeUndefined();

      result = getCoverageDatesFunction(ReportCodes.TwelveP);
      expect(result).toBeUndefined();

      result = getCoverageDatesFunction(ReportCodes.TwelveR);
      expect(result).toBeUndefined();

      result = getCoverageDatesFunction(ReportCodes.TwelveS);
      expect(result).toBeUndefined();

      result = getCoverageDatesFunction(ReportCodes.TwelveC);
      expect(result).toBeUndefined();

      result = getCoverageDatesFunction(ReportCodes.ThirtyG);
      expect(result).toBeUndefined();

      result = getCoverageDatesFunction(ReportCodes.ThirtyR);
      expect(result).toBeUndefined();

      result = getCoverageDatesFunction(ReportCodes.ThirtyS);
      expect(result).toBeUndefined();
    });
  });
});
