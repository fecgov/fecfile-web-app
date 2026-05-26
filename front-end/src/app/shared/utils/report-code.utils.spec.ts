import { DateUtils } from './date.utils';
import { calculateDates, ReportCodes } from './report-code.utils';

describe('ReportCodeUtils', () => {
  describe('calculateDates', () => {
    it('should return correct value for Q1', () => {
      const [startDate, endDate] = calculateDates(ReportCodes.Q1, 2024, true, 'Q')!;
      expect(startDate?.getMonth()).toBe(0);
      expect(startDate?.getDate()).toBe(1);
      expect(endDate.getMonth()).toBe(2);
      expect(endDate.getDate()).toBe(31);
    });

    it('should return correct value for Q2', () => {
      const [startDate, endDate] = calculateDates(ReportCodes.Q2, 2024, true, 'Q')!;
      expect(startDate?.getMonth()).toBe(3);
      expect(startDate?.getDate()).toBe(1);
      expect(endDate.getMonth()).toBe(5);
      expect(endDate.getDate()).toBe(30);
    });

    it('should return correct value for Q3', () => {
      const [startDate, endDate] = calculateDates(ReportCodes.Q3, 2024, true, 'Q')!;
      expect(startDate?.getMonth()).toBe(6);
      expect(startDate?.getDate()).toBe(1);
      expect(endDate.getMonth()).toBe(8);
      expect(endDate.getDate()).toBe(30);
    });

    it('should return correct value for YE when current month is January', () => {
      vi.spyOn(DateUtils, 'isCurrentMonthJanuary').mockReturnValue(true);

      // Test for election year
      expect(DateUtils.isCurrentMonthJanuary()).toBeTruthy();
      let [startDate, endDate] = calculateDates(ReportCodes.YE, 2024, true, 'Q')!;
      expect(startDate).toBe(undefined);
      expect(endDate.getFullYear()).toBe(2024);
      expect(endDate.getMonth()).toBe(11);
      expect(endDate.getDate()).toBe(31);

      // Test for non-election year with filingFrequency 'Q'
      [startDate, endDate] = calculateDates(ReportCodes.YE, 2024, false, 'Q')!;
      expect(startDate?.getFullYear()).toBe(2023);
      expect(startDate?.getMonth()).toBe(6);
      expect(startDate?.getDate()).toBe(1);
      expect(endDate.getFullYear()).toBe(2023);
      expect(endDate.getMonth()).toBe(11);
      expect(endDate.getDate()).toBe(31);

      // Test for non-election year with filingFrequency other than 'Q'
      [startDate, endDate] = calculateDates(ReportCodes.YE, 2024, false, 'M')!;
      expect(startDate?.getFullYear()).toBe(2023);
      expect(startDate?.getMonth()).toBe(11);
      expect(startDate?.getDate()).toBe(1);
      expect(endDate.getFullYear()).toBe(2023);
      expect(endDate.getMonth()).toBe(11);
      expect(endDate.getDate()).toBe(31);
    });

    it('should return correct value for YE when current month is not January', () => {
      vi.spyOn(DateUtils, 'isCurrentMonthJanuary').mockReturnValue(false);

      // Test for election year
      let [startDate, endDate] = calculateDates(ReportCodes.YE, 2024, true, 'Q')!;
      expect(startDate).toBe(undefined);
      expect(endDate.getFullYear()).toBe(2024);
      expect(endDate.getMonth()).toBe(11);
      expect(endDate.getDate()).toBe(31);

      // Test for non-election year with filingFrequency 'Q'
      [startDate, endDate] = calculateDates(ReportCodes.YE, 2024, false, 'Q')!;
      expect(startDate?.getFullYear()).toBe(2024);
      expect(startDate?.getMonth()).toBe(6);
      expect(startDate?.getDate()).toBe(1);
      expect(endDate.getFullYear()).toBe(2024);
      expect(endDate.getMonth()).toBe(11);
      expect(endDate.getDate()).toBe(31);

      // Test for non-election year with filingFrequency other than 'Q'
      [startDate, endDate] = calculateDates(ReportCodes.YE, 2024, false, 'M')!;
      expect(startDate?.getFullYear()).toBe(2024);
      expect(startDate?.getMonth()).toBe(11);
      expect(startDate?.getDate()).toBe(1);
      expect(endDate.getFullYear()).toBe(2024);
      expect(endDate.getMonth()).toBe(11);
      expect(endDate.getDate()).toBe(31);
    });

    it('should return correct value for M2', () => {
      const [startDate, endDate] = calculateDates(ReportCodes.M2, 2024, true, 'M')!;
      expect(startDate?.getMonth()).toBe(0);
      expect(startDate?.getDate()).toBe(1);
      expect(endDate.getMonth()).toBe(0);
      expect(endDate.getDate()).toBe(31);
    });

    it('should return correct value for M3', () => {
      const [startDate, endDate] = calculateDates(ReportCodes.M3, 2024, true, 'M')!;
      expect(startDate?.getMonth()).toBe(1);
      expect(startDate?.getDate()).toBe(1);
      expect(endDate.getMonth()).toBe(1);
      expect(endDate.getDate()).toBe(29);

      const [, endDate1] = calculateDates(ReportCodes.M3, 2025, true, 'M')!;
      expect(endDate1.getDate()).toBe(28);
    });

    it('should return correct value for M4', () => {
      const [startDate, endDate] = calculateDates(ReportCodes.M4, 2024, true, 'M')!;
      expect(startDate?.getMonth()).toBe(2);
      expect(startDate?.getDate()).toBe(1);
      expect(endDate.getMonth()).toBe(2);
      expect(endDate.getDate()).toBe(31);
    });

    it('should return correct value for M5', () => {
      const [startDate, endDate] = calculateDates(ReportCodes.M5, 2024, true, 'M')!;
      expect(startDate?.getMonth()).toBe(3);
      expect(startDate?.getDate()).toBe(1);
      expect(endDate.getMonth()).toBe(3);
      expect(endDate.getDate()).toBe(30);
    });

    it('should return correct value for M6', () => {
      const [startDate, endDate] = calculateDates(ReportCodes.M6, 2024, true, 'M')!;
      expect(startDate?.getMonth()).toBe(4);
      expect(startDate?.getDate()).toBe(1);
      expect(endDate.getMonth()).toBe(4);
      expect(endDate.getDate()).toBe(31);
    });

    it('should return correct value for M7', () => {
      const [startDate, endDate] = calculateDates(ReportCodes.M7, 2024, true, 'M')!;
      expect(startDate?.getMonth()).toBe(5);
      expect(startDate?.getDate()).toBe(1);
      expect(endDate.getMonth()).toBe(5);
      expect(endDate.getDate()).toBe(30);
    });

    it('should return correct value for M8', () => {
      const [startDate, endDate] = calculateDates(ReportCodes.M8, 2024, true, 'M')!;
      expect(startDate?.getMonth()).toBe(6);
      expect(startDate?.getDate()).toBe(1);
      expect(endDate.getMonth()).toBe(6);
      expect(endDate.getDate()).toBe(31);
    });

    it('should return correct value for M9', () => {
      const [startDate, endDate] = calculateDates(ReportCodes.M9, 2024, true, 'M')!;
      expect(startDate?.getMonth()).toBe(7);
      expect(startDate?.getDate()).toBe(1);
      expect(endDate.getMonth()).toBe(7);
      expect(endDate.getDate()).toBe(31);
    });

    it('should return correct value for M10', () => {
      const [startDate, endDate] = calculateDates(ReportCodes.M10, 2024, true, 'M')!;
      expect(startDate?.getMonth()).toBe(8);
      expect(startDate?.getDate()).toBe(1);
      expect(endDate.getMonth()).toBe(8);
      expect(endDate.getDate()).toBe(30);
    });

    it('should return correct value for M11', () => {
      const [startDate, endDate] = calculateDates(ReportCodes.M11, 2024, true, 'M')!;
      expect(startDate?.getMonth()).toBe(9);
      expect(startDate?.getDate()).toBe(1);
      expect(endDate.getMonth()).toBe(9);
      expect(endDate.getDate()).toBe(31);
    });

    it('should return correct value for M12', () => {
      const [startDate, endDate] = calculateDates(ReportCodes.M12, 2024, true, 'M')!;
      expect(startDate?.getMonth()).toBe(10);
      expect(startDate?.getDate()).toBe(1);
      expect(endDate.getMonth()).toBe(10);
      expect(endDate.getDate()).toBe(30);
    });

    it('should return undefined for all others', () => {
      expect(calculateDates(ReportCodes.TER, 2024, true, 'Q')).toBeUndefined();
      expect(calculateDates(ReportCodes.TwelveG, 2024, true, 'Q')).toBeUndefined();
      expect(calculateDates(ReportCodes.TwelveP, 2024, true, 'Q')).toBeUndefined();
      expect(calculateDates(ReportCodes.TwelveR, 2024, true, 'Q')).toBeUndefined();
      expect(calculateDates(ReportCodes.TwelveS, 2024, true, 'Q')).toBeUndefined();
      expect(calculateDates(ReportCodes.TwelveC, 2024, true, 'Q')).toBeUndefined();
      expect(calculateDates(ReportCodes.ThirtyG, 2024, true, 'Q')).toBeUndefined();
      expect(calculateDates(ReportCodes.ThirtyR, 2024, true, 'Q')).toBeUndefined();
      expect(calculateDates(ReportCodes.ThirtyS, 2024, true, 'Q')).toBeUndefined();
    });
  });
});
