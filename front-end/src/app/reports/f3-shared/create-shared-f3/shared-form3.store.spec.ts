import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { BaseForm3, CoverageDates } from 'app/shared/models/reports/base-form-3';
import { FORM_3_SERVICE } from 'app/shared/services/base-form-3.service';
import { ReportCodes } from 'app/shared/utils/report-code.utils';
import { BehaviorSubject } from 'rxjs';
import { SharedForm3Store, currentYear } from './shared-form3.store';

describe('SharedForm3Store', () => {
  let store: SharedForm3Store;
  let reportData: BehaviorSubject<BaseForm3 | null>;
  let coverageData: BehaviorSubject<CoverageDates[]>;

  let activeService: {
    getReportCodeLabelMap: ReturnType<typeof vi.fn>;
    isF3X: boolean;
  };

  const reportCodes = Object.values(ReportCodes).filter((value): value is ReportCodes => typeof value === 'string');

  const reportCode = reportCodes[0];
  const anotherReportCode = reportCodes[1];

  const coverage = (code: ReportCodes, fromYear: number, throughYear: number): CoverageDates =>
    ({
      coverage_from_date: new Date(fromYear, 0, 1),
      coverage_through_date: new Date(throughYear, 11, 31),
      report_code: code,
    }) as CoverageDates;

  const initialReport: BaseForm3 | null = null;
  const initialExisting: CoverageDates[] = [];

  beforeEach(() => {
    reportData = new BehaviorSubject<BaseForm3 | null>(null);
    coverageData = new BehaviorSubject<CoverageDates[]>([]);

    activeService = {
      getReportCodeLabelMap: vi.fn().mockResolvedValue({}),
      isF3X: false,
    };

    TestBed.configureTestingModule({
      providers: [
        SharedForm3Store,
        { provide: FORM_3_SERVICE, useValue: activeService },
        {
          provide: ActivatedRoute,
          useValue: { data: { report: reportData, coverageDates: coverageData } },
        },
      ],
    });

    store = TestBed.inject(SharedForm3Store);
  });

  describe('report', () => {
    it('should default to null when there is no report', () => {
      expect(store.report()).toBeNull();
    });

    it('should expose the report from route data', () => {
      const report = { report_code: reportCode } as BaseForm3;

      reportData.next(report);

      expect(store.report()).toBe(report);
    });

    it('should expose null when route data contains a null report', () => {
      reportData.next(null);
      expect(store.report()).toBeNull();
    });
  });

  describe('existingCoverage', () => {
    it('should expose coverage from resolved route data', () => {
      const existingCoverage = [coverage(reportCode, currentYear, currentYear)];
      reportData.next(null);
      coverageData.next(existingCoverage);

      expect(store.existingCoverage()).toEqual(existingCoverage);
    });

    it('should update when resolved route data changes', () => {
      const firstCoverage = [coverage(reportCode, currentYear, currentYear)];
      const secondCoverage = [coverage(anotherReportCode, currentYear, currentYear)];
      reportData.next(null);
      coverageData.next(firstCoverage);
      expect(store.existingCoverage()).toEqual(firstCoverage);

      coverageData.next(secondCoverage);
      expect(store.existingCoverage()).toEqual(secondCoverage);
    });
  });

  describe('reportCodeLabelMap', () => {
    it('should load the report-code label map', async () => {
      const labels = { [reportCode]: 'Test report code' };
      activeService.getReportCodeLabelMap.mockResolvedValue(labels);

      await vi.waitFor(() => expect(store.reportCodeLabelMap.value()).toEqual(labels));

      expect(activeService.getReportCodeLabelMap).toHaveBeenCalledOnce();
    });
  });

  describe('usedReportCodes', () => {
    it('should return an empty array when there is no existing coverage', () => {
      expect(store.usedReportCodes()).toEqual([]);
    });

    it('should include codes when the coverage starts in the current year', () => {
      reportData.next(null);
      coverageData.next([coverage(reportCode, currentYear, currentYear - 1)]);

      expect(store.usedReportCodes()).toEqual([reportCode]);
    });

    it('should include codes when the coverage ends in the current year', () => {
      reportData.next(null);
      coverageData.next([coverage(reportCode, currentYear - 1, currentYear)]);

      expect(store.usedReportCodes()).toEqual([reportCode]);
    });

    it('should exclude codes when neither coverage date is in the current year', () => {
      reportData.next(null);
      coverageData.next([coverage(reportCode, currentYear - 2, currentYear - 1)]);

      expect(store.usedReportCodes()).toEqual([]);
    });

    it('should include multiple codes used in the current year', () => {
      reportData.next(null);
      coverageData.next([
        coverage(reportCode, currentYear, currentYear),
        coverage(anotherReportCode, currentYear - 1, currentYear),
      ]);

      expect(store.usedReportCodes()).toEqual([reportCode, anotherReportCode]);
    });
  });

  describe('disabledReportCodes', () => {
    it('should return an entry for every report code', () => {
      expect(Object.keys(store.disabledReportCodes()).sort()).toEqual(reportCodes.sort());
    });

    it('should disable codes already used in the current year', () => {
      reportData.next(null);
      coverageData.next([coverage(reportCode, currentYear, currentYear)]);

      expect(store.disabledReportCodes()[reportCode]).toBe(true);
    });

    it('should not disable codes that have not been used in the current year', () => {
      reportData.next(null);
      coverageData.next([coverage(reportCode, currentYear - 2, currentYear - 1)]);

      expect(store.disabledReportCodes()[reportCode]).toBe(false);
    });

    it('should not disable the current report code even when it is already used', () => {
      const report = {
        coverage_from_date: new Date(currentYear - 1, 0, 1),
        report_code: reportCode,
      } as BaseForm3;
      reportData.next(report);
      coverageData.next([coverage(reportCode, currentYear, currentYear)]);

      expect(store.disabledReportCodes()[reportCode]).toBe(false);
    });
  });

  describe('title', () => {
    it('should return Form 3 when the service is not Form 3X', () => {
      activeService.isF3X = false;

      expect(store.title()).toBe('Form 3');
    });

    it('should return Form 3X when the service is Form 3X', () => {
      activeService.isF3X = true;

      expect(store.title()).toBe('Form 3X');
    });
  });

  describe('subLabel', () => {
    it('should return the authorized committee label for Form 3', () => {
      activeService.isF3X = false;

      expect(store.subLabel()).toBe('REPORT OF RECEIPTS AND DISBURSEMENTS FOR AN AUTHORIZED COMMITTEE');
    });

    it('should return the other-than-authorized committee label for Form 3X', () => {
      activeService.isF3X = true;

      expect(store.subLabel()).toBe('REPORT OF RECEIPTS AND DISBURSEMENTS FOR OTHER THAN AN AUTHORIZED COMMITTEE');
    });
  });
});
