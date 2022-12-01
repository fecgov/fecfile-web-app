import { F3xReportCode, F3xReportCodes, F3X_REPORT_CODE_MAP, getReportCodeLabel } from './report-code.utils';

describe('ReportCodeUtils', () => {
  describe('F3xReportCode', () => {
    it('should carry properties', () => {
      const coverageDateFunction = (year: number): [Date, Date] => {
        return [new Date(year, 0, 1), new Date(year, 0, 2)];
      };
      const f3xReportCode = new F3xReportCode('MY', 'label for MY', coverageDateFunction);
      expect(f3xReportCode.label).toBe('label for MY');
      expect(f3xReportCode.coverageDatesFunction).toEqual(coverageDateFunction);
    });
  });

  describe('F3X_REPORT_CODE_MAP', () => {
    it('should have Q1', () => {
      const Q1 = F3X_REPORT_CODE_MAP.get(F3xReportCodes.Q1);
      expect(Q1).toBeTruthy();
      expect(Q1?.label).toEqual('APRIL 15 QUARTERLY REPORT (Q1)');
      if (Q1?.coverageDatesFunction) {
        expect(Q1.coverageDatesFunction(2022, false, 'M')).toEqual([new Date(2022, 0, 1), new Date(2022, 2, 31)]);
      }
    });
    it('should have M3', () => {
      const M3 = F3X_REPORT_CODE_MAP.get(F3xReportCodes.M3);
      expect(M3).toBeTruthy();
      expect(M3?.label).toEqual('MARCH 20 MONTHLY REPORT (M3)');
      if (M3?.coverageDatesFunction) {
        expect(M3.coverageDatesFunction(2022, false, 'M')).toEqual([new Date(2022, 1, 1), new Date(2022, 1, 28)]);
        // test leap year
        expect(M3.coverageDatesFunction(2020, false, 'M')).toEqual([new Date(2020, 1, 1), new Date(2020, 1, 29)]);
      }
    });
    it('should have YE', () => {
      const YE = F3X_REPORT_CODE_MAP.get(F3xReportCodes.YE);
      expect(YE).toBeTruthy();
      expect(YE?.label).toEqual('JANUARY 31 YEAR-END (YE)');
      if (YE?.coverageDatesFunction) {
        expect(YE.coverageDatesFunction(2022, false, 'M')).toEqual([new Date(2021, 11, 1), new Date(2021, 11, 31)]);
        // Quarterly non-election year
        expect(YE.coverageDatesFunction(2022, false, 'Q')).toEqual([new Date(2021, 6, 1), new Date(2021, 11, 31)]);
        // Quarterly election year
        expect(YE.coverageDatesFunction(2022, true, 'Q')).toEqual([new Date(2021, 9, 1), new Date(2021, 11, 31)]);
      }
    });
  });

  describe('getReportCodeLabel', () => {
    it('should get label for report code', () => {
      expect(getReportCodeLabel(F3xReportCodes.YE)).toEqual('JANUARY 31 YEAR-END (YE)');
      expect(getReportCodeLabel()).toEqual(undefined);
    });
  });
});
