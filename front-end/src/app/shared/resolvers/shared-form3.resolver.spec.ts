import { Injector, runInInjectionContext } from '@angular/core';
import { ActivatedRouteSnapshot, convertToParamMap, RedirectCommand, Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { FORM_3_SERVICE } from 'app/shared/services/base-form-3.service';
import { ElectionCycleService } from 'app/tools/election-cycle/election-cycle.service';
import type { Form3 } from '../models/reports/form-3.model';
import type { ElectionCycle } from 'app/tools/election-cycle/election-cycle.model';
import { form3CoverageResolver, form3ElectionCycleResolver, sharedForm3Resolver } from './shared-form3.resolver';
import { ReportService } from 'app/shared/services/report.service';

describe('Form 3 resolvers', () => {
  let injector: Injector;
  let router: Router;
  let route: ActivatedRouteSnapshot;
  let setActiveReportById: ReturnType<typeof vi.fn>;

  let getCoverageDates: ReturnType<typeof vi.fn>;
  let getElectionCycle: ReturnType<typeof vi.fn>;

  const coverageDate1 = new Date('2025-01-01');
  const coverageDate2 = new Date('2025-04-01');
  const coverageDate3 = new Date('2025-07-01');

  const coverageDates = [
    { coverage_from_date: coverageDate1 },
    { coverage_from_date: coverageDate2 },
    { coverage_from_date: coverageDate3 },
  ];

  const createReport = (overrides: Partial<Form3> = {}): Form3 =>
    ({
      coverage_from_date: coverageDate2,
      electionCycleId: 'cycle-1',
      nextElectionCycleId: null,
      electionCycle: null,
      nextElectionCycle: null,
      ...overrides,
    }) as Form3;

  const createRoute = (reportId: string | null = null): ActivatedRouteSnapshot =>
    ({
      paramMap: convertToParamMap(reportId ? { reportId } : {}),
    }) as ActivatedRouteSnapshot;

  const resolve = <T>(resolver: (route: ActivatedRouteSnapshot) => Promise<T>): Promise<T> =>
    runInInjectionContext(injector, () => resolver(route));

  beforeEach(() => {
    setActiveReportById = vi.fn();
    getCoverageDates = vi.fn().mockResolvedValue(coverageDates);
    getElectionCycle = vi.fn();

    TestBed.configureTestingModule({
      providers: [
        {
          provide: FORM_3_SERVICE,
          useValue: { getCoverageDates },
        },
        {
          provide: ElectionCycleService,
          useValue: { get: getElectionCycle },
        },
        {
          provide: ReportService,
          useValue: { setActiveReportById },
        },
      ],
    });

    injector = TestBed.inject(Injector);
    router = TestBed.inject(Router);
    route = createRoute('report-1');
  });

  describe('sharedForm3Resolver', () => {
    it('should resolve the report', async () => {
      const report = createReport();
      setActiveReportById.mockResolvedValue(report);
      const result = await resolve(sharedForm3Resolver);
      expect(result).toBe(report);
      expect(setActiveReportById).toHaveBeenCalledOnce();
      expect(setActiveReportById).toHaveBeenCalledWith('report-1');
    });

    it('should return a RedirectCommand when reportResolver redirects', async () => {
      const redirect = new RedirectCommand(router.parseUrl('/reports'));
      setActiveReportById.mockRejectedValue(new Error('Report not found'));
      const result = await resolve(sharedForm3Resolver);
      expect(result).toStrictEqual(redirect);
    });
  });

  describe('form3CoverageResolver', () => {
    it('should resolve coverage dates without a report when creating a report', async () => {
      route = createRoute();
      const result = await resolve(form3CoverageResolver);
      expect(result).toEqual({
        report: null,
        existingCoverage: coverageDates,
      });
      expect(getCoverageDates).toHaveBeenCalledOnce();
      expect(setActiveReportById).not.toHaveBeenCalled();
    });

    it('should resolve the report and filter its coverage date when editing a report', async () => {
      const report = createReport();
      setActiveReportById.mockResolvedValue(report);
      const result = await resolve(form3CoverageResolver);
      expect(result).toEqual({
        report,
        existingCoverage: [coverageDates[0], coverageDates[2]],
      });
      expect(getCoverageDates).toHaveBeenCalledOnce();
      expect(setActiveReportById).toHaveBeenCalledWith('report-1');
    });

    it('should return a RedirectCommand when resolving the report redirects', async () => {
      const redirect = new RedirectCommand(router.parseUrl('/reports'));
      route = createRoute('report-1');
      setActiveReportById.mockRejectedValue(new Error('Report not found'));
      const result = await resolve(form3CoverageResolver);
      expect(result).toStrictEqual(redirect);
    });
  });

  describe('form3ElectionCycleResolver', () => {
    it('should resolve the election cycle', async () => {
      const report = createReport();
      const electionCycle = { id: 'cycle-1' } as ElectionCycle;
      setActiveReportById.mockResolvedValue(report);
      getElectionCycle.mockResolvedValue(electionCycle);
      let result = await resolve(form3ElectionCycleResolver);
      expect(result).toBe(report);
      result = result as Form3;
      expect(getElectionCycle).toHaveBeenCalledOnce();
      expect(getElectionCycle).toHaveBeenCalledWith('cycle-1');
      expect(result.electionCycle).toBe(electionCycle);
      expect(result.nextElectionCycle).toBeNull();
    });

    it('should resolve both election cycles when a next election cycle exists', async () => {
      const report = createReport({ nextElectionCycleId: 'cycle-2' });
      const electionCycle = { id: 'cycle-1' } as ElectionCycle;
      const nextElectionCycle = { id: 'cycle-2' } as ElectionCycle;
      getElectionCycle.mockResolvedValueOnce(electionCycle).mockResolvedValueOnce(nextElectionCycle);
      setActiveReportById.mockResolvedValue(report);
      const result = (await resolve(form3ElectionCycleResolver)) as Form3;
      expect(getElectionCycle).toHaveBeenCalledTimes(2);
      expect(getElectionCycle).toHaveBeenNthCalledWith(1, 'cycle-1');
      expect(getElectionCycle).toHaveBeenNthCalledWith(2, 'cycle-2');
      expect(result.electionCycle).toBe(electionCycle);
      expect(result.nextElectionCycle).toBe(nextElectionCycle);
    });

    it('should return a RedirectCommand when resolving the report redirects', async () => {
      const redirect = new RedirectCommand(router.parseUrl('/reports'));
      setActiveReportById.mockRejectedValue(new Error('Report not found'));
      const result = await resolve(form3ElectionCycleResolver);
      expect(result).toStrictEqual(redirect);
      expect(getElectionCycle).not.toHaveBeenCalled();
    });
  });
});
