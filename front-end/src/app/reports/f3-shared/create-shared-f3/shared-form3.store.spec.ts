import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { BaseForm3, CoverageDates } from 'app/shared/models/reports/base-form-3';
import { FORM_3_SERVICE } from 'app/shared/services/base-form-3.service';
import { ReportCodes } from 'app/shared/utils/report-code.utils';
import { currentYear, SharedForm3Store } from './shared-form3.store';

describe('SharedForm3Store', () => {
  let store: SharedForm3Store;
  let mockRouteData$: BehaviorSubject<{
    reportCoverage: { report: BaseForm3 | null; existingCoverage: CoverageDates[] };
  }>;
  let mockForm3Service: {
    isF3X: boolean;
    getReportCodeLabelMap: ReturnType<typeof vi.fn>;
  };

  const createCoverage = (reportCode: ReportCodes, fromYear: number, throughYear: number): CoverageDates =>
    ({
      report_code: reportCode,
      coverage_from_date: new Date(fromYear, 0, 1),
      coverage_through_date: new Date(throughYear, 11, 31),
    }) as CoverageDates;

  beforeEach(() => {
    mockRouteData$ = new BehaviorSubject({
      reportCoverage: {
        report: null as BaseForm3 | null,
        existingCoverage: [] as CoverageDates[],
      },
    });

    mockForm3Service = {
      isF3X: false,
      getReportCodeLabelMap: vi.fn().mockResolvedValue({
        [ReportCodes.Q1]: 'Quarter 1',
        [ReportCodes.Q2]: 'Quarter 2',
      }),
    };

    TestBed.configureTestingModule({
      providers: [
        SharedForm3Store,
        {
          provide: ActivatedRoute,
          useValue: { data: mockRouteData$.asObservable() },
        },
        {
          provide: FORM_3_SERVICE,
          useValue: mockForm3Service,
        },
      ],
    });

    store = TestBed.inject(SharedForm3Store);
  });

  describe('Route Signal & Derived Selectors', () => {
    it('should provide default values when reportCoverage is empty', () => {
      expect(store.report()).toBeNull();
      expect(store.existingCoverage()).toEqual([]);
    });

    it('should reflect incoming route data for report and existingCoverage', () => {
      const mockReport = { report_code: ReportCodes.Q1 } as BaseForm3;
      const mockCoverage: CoverageDates[] = [createCoverage(ReportCodes.Q2, currentYear, currentYear)];

      mockRouteData$.next({
        reportCoverage: {
          report: mockReport,
          existingCoverage: mockCoverage,
        },
      });

      TestBed.tick();

      expect(store.report()).toEqual(mockReport);
      expect(store.existingCoverage()).toEqual(mockCoverage);
    });
  });

  describe('usedReportCodes', () => {
    it('should filter coverage items that include the current year', () => {
      const mockCoverage: CoverageDates[] = [
        createCoverage(ReportCodes.Q1, currentYear, currentYear),
        createCoverage(ReportCodes.Q2, currentYear - 1, currentYear), // through_date matches current year
        createCoverage(ReportCodes.Q3, currentYear - 2, currentYear - 1), // prior years only
      ];

      mockRouteData$.next({
        reportCoverage: {
          report: null,
          existingCoverage: mockCoverage,
        },
      });

      TestBed.tick();

      expect(store.usedReportCodes()).toContain(ReportCodes.Q1);
      expect(store.usedReportCodes()).toContain(ReportCodes.Q2);
      expect(store.usedReportCodes()).not.toContain(ReportCodes.Q3);
    });
  });

  describe('disabledReportCodes', () => {
    it('should disable codes present in usedReportCodes', () => {
      mockRouteData$.next({
        reportCoverage: {
          report: null,
          existingCoverage: [createCoverage(ReportCodes.Q1, currentYear, currentYear)],
        },
      });

      TestBed.tick();

      const disabledMap = store.disabledReportCodes();
      expect(disabledMap[ReportCodes.Q1]).toBe(true);
      expect(disabledMap[ReportCodes.Q2]).toBe(false);
    });

    it('should NOT disable a code if it matches the current report code, even if used', () => {
      const currentReport = { report_code: ReportCodes.Q1 } as BaseForm3;

      mockRouteData$.next({
        reportCoverage: {
          report: currentReport,
          existingCoverage: [createCoverage(ReportCodes.Q1, currentYear, currentYear)],
        },
      });

      TestBed.tick();

      const disabledMap = store.disabledReportCodes();
      expect(disabledMap[ReportCodes.Q1]).toBe(false);
    });
  });

  describe('reportCodeLabelMap (resource)', () => {
    it('should load label map from activeService via resource loader', async () => {
      const labelMap = { [ReportCodes.Q1]: 'Quarter 1' };
      mockForm3Service.getReportCodeLabelMap.mockResolvedValueOnce(labelMap);

      TestBed.tick();

      await vi.waitFor(() => {
        expect(store.reportCodeLabelMap.value()).toEqual(labelMap);
      });
      expect(mockForm3Service.getReportCodeLabelMap).toHaveBeenCalledTimes(1);
    });
  });

  describe('title & subLabel', () => {
    it('should return Form 3 labels when isF3X is false', () => {
      mockForm3Service.isF3X = false;
      TestBed.tick();

      expect(store.title()).toBe('Form 3');
      expect(store.subLabel()).toBe('REPORT OF RECEIPTS AND DISBURSEMENTS FOR AN AUTHORIZED COMMITTEE');
    });

    it('should return Form 3X labels when isF3X is true', () => {
      mockForm3Service.isF3X = true;
      TestBed.tick();

      expect(store.title()).toBe('Form 3X');
      expect(store.subLabel()).toBe('REPORT OF RECEIPTS AND DISBURSEMENTS FOR OTHER THAN AN AUTHORIZED COMMITTEE');
    });
  });
});
