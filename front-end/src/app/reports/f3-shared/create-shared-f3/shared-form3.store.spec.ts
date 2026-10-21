import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { BaseForm3 } from 'app/shared/models/reports/base-form-3';
import type { SharedForm3InitialData } from 'app/shared/resolvers/shared-form3.resolver';
import { FORM_3_SERVICE } from 'app/shared/services/base-form-3.service';
import { ReportCodes } from 'app/shared/utils/report-code.utils';
import { BehaviorSubject } from 'rxjs';
import { SharedForm3Store, currentYear } from './shared-form3.store';

type CoverageDate = SharedForm3InitialData['existingCoverage'][number];

describe('SharedForm3Store', () => {
  let store: SharedForm3Store;
  let routeData: BehaviorSubject<{ initialData: SharedForm3InitialData }>;

  let activeService: {
    getReportCodeLabelMap: ReturnType<typeof vi.fn>;
    isF3X: boolean;
  };

  const reportCodes = Object.values(ReportCodes).filter((value): value is ReportCodes => typeof value === 'string');

  const reportCode = reportCodes[0];
  const anotherReportCode = reportCodes[1];

  const coverage = (code: ReportCodes, fromYear: number, throughYear: number): CoverageDate =>
    ({
      coverage_from_date: new Date(fromYear, 0, 1),
      coverage_through_date: new Date(throughYear, 11, 31),
      report_code: code,
    }) as CoverageDate;

  const initialData = (
    report: BaseForm3 | null = null,
    existingCoverage: CoverageDate[] = [],
  ): SharedForm3InitialData => ({
    report,
    existingCoverage,
  });

  beforeEach(() => {
    routeData = new BehaviorSubject({
      initialData: initialData(),
    });

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
          useValue: { data: routeData.asObservable() },
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

      routeData.next({ initialData: initialData(report) });

      expect(store.report()).toBe(report);
    });

    it('should expose null when route data contains a null report', () => {
      routeData.next({ initialData: initialData(null) });

      expect(store.report()).toBeNull();
    });
  });

  describe('existingCoverage', () => {
    it('should expose coverage from resolved route data', () => {
      const existingCoverage = [coverage(reportCode, currentYear, currentYear)];

      routeData.next({ initialData: initialData(null, existingCoverage) });

      expect(store.existingCoverage()).toEqual(existingCoverage);
    });

    it('should update when resolved route data changes', () => {
      const firstCoverage = [coverage(reportCode, currentYear, currentYear)];
      const secondCoverage = [coverage(anotherReportCode, currentYear, currentYear)];

      routeData.next({ initialData: initialData(null, firstCoverage) });
      expect(store.existingCoverage()).toEqual(firstCoverage);

      routeData.next({ initialData: initialData(null, secondCoverage) });
      expect(store.existingCoverage()).toEqual(secondCoverage);
    });
  });

  describe('reportCodeLabelMap', () => {
    it('should load the report-code label map', async () => {
      const labels = { [reportCode]: 'Test report code' };
      activeService.getReportCodeLabelMap.mockResolvedValue(labels);

      await vi.waitFor(() => {
        expect(store.reportCodeLabelMap.value()).toEqual(labels);
      });

      expect(activeService.getReportCodeLabelMap).toHaveBeenCalledOnce();
    });
  });

  describe('usedReportCodes', () => {
    it('should return an empty array when there is no existing coverage', () => {
      expect(store.usedReportCodes()).toEqual([]);
    });

    it('should include codes when the coverage starts in the current year', () => {
      routeData.next({
        initialData: initialData(null, [coverage(reportCode, currentYear, currentYear - 1)]),
      });

      expect(store.usedReportCodes()).toEqual([reportCode]);
    });

    it('should include codes when the coverage ends in the current year', () => {
      routeData.next({
        initialData: initialData(null, [coverage(reportCode, currentYear - 1, currentYear)]),
      });

      expect(store.usedReportCodes()).toEqual([reportCode]);
    });

    it('should exclude codes when neither coverage date is in the current year', () => {
      routeData.next({
        initialData: initialData(null, [coverage(reportCode, currentYear - 2, currentYear - 1)]),
      });

      expect(store.usedReportCodes()).toEqual([]);
    });

    it('should include multiple codes used in the current year', () => {
      routeData.next({
        initialData: initialData(null, [
          coverage(reportCode, currentYear, currentYear),
          coverage(anotherReportCode, currentYear - 1, currentYear),
        ]),
      });

      expect(store.usedReportCodes()).toEqual([reportCode, anotherReportCode]);
    });
  });

  describe('disabledReportCodes', () => {
    it('should return an entry for every report code', () => {
      expect(Object.keys(store.disabledReportCodes()).sort()).toEqual(reportCodes.sort());
    });

    it('should disable codes already used in the current year', () => {
      routeData.next({
        initialData: initialData(null, [coverage(reportCode, currentYear, currentYear)]),
      });

      expect(store.disabledReportCodes()[reportCode]).toBe(true);
    });

    it('should not disable codes that have not been used in the current year', () => {
      routeData.next({
        initialData: initialData(null, [coverage(reportCode, currentYear - 2, currentYear - 1)]),
      });

      expect(store.disabledReportCodes()[reportCode]).toBe(false);
    });

    it('should not disable the current report code even when it is already used', () => {
      const report = {
        coverage_from_date: new Date(currentYear - 1, 0, 1),
        report_code: reportCode,
      } as BaseForm3;

      routeData.next({
        initialData: initialData(report, [coverage(reportCode, currentYear, currentYear)]),
      });

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
