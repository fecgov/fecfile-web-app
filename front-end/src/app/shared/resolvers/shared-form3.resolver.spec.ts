import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { BaseForm3, CoverageDates } from 'app/shared/models/reports/base-form-3';
import { ReportResolver } from 'app/shared/resolvers/report.resolver';
import { FORM_3_SERVICE } from 'app/shared/services/base-form-3.service';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SharedForm3Resolver } from './shared-form3.resolver';

describe('SharedForm3Resolver', () => {
  let resolver: SharedForm3Resolver;
  let reportResolver: { resolve: ReturnType<typeof vi.fn> };
  let activeService: { getCoverageDates: ReturnType<typeof vi.fn> };
  let route: ActivatedRouteSnapshot;

  const createCoverage = (startDate: Date, endDate: Date): CoverageDates =>
    ({
      coverage_from_date: startDate,
      coverage_through_date: endDate,
    }) as CoverageDates;

  beforeEach(() => {
    route = {} as ActivatedRouteSnapshot;

    reportResolver = { resolve: vi.fn().mockResolvedValue(null) };

    activeService = { getCoverageDates: vi.fn().mockResolvedValue([]) };

    TestBed.configureTestingModule({
      providers: [
        SharedForm3Resolver,
        { provide: ReportResolver, useValue: reportResolver },
        { provide: FORM_3_SERVICE, useValue: activeService },
      ],
    });

    resolver = TestBed.inject(SharedForm3Resolver);
  });

  it('should return null report and all coverage when no report is resolved', async () => {
    const coverage = [
      createCoverage(new Date(2026, 0, 1), new Date(2026, 2, 31)),
      createCoverage(new Date(2026, 3, 1), new Date(2026, 5, 30)),
    ];

    reportResolver.resolve.mockResolvedValue(undefined);
    activeService.getCoverageDates.mockResolvedValue(coverage);

    const result = await resolver.resolve(route);

    expect(reportResolver.resolve).toHaveBeenCalledWith(route);
    expect(activeService.getCoverageDates).toHaveBeenCalledOnce();
    expect(result).toEqual({ report: null, existingCoverage: coverage });
  });

  it('should return null report when the report resolver returns null', async () => {
    const coverage = [createCoverage(new Date(2026, 0, 1), new Date(2026, 2, 31))];

    reportResolver.resolve.mockResolvedValue(null);
    activeService.getCoverageDates.mockResolvedValue(coverage);

    const result = await resolver.resolve(route);
    expect(result).toEqual({ report: null, existingCoverage: coverage });
  });

  it('should exclude coverage with the same start date as the current report', async () => {
    const startDate = new Date(2026, 0, 1);
    const report = {
      coverage_from_date: startDate,
      report_code: 'Q1',
    } as unknown as BaseForm3;

    const matchingCoverage = createCoverage(new Date(startDate.getTime()), new Date(2026, 2, 31));
    const otherCoverage = createCoverage(new Date(2026, 3, 1), new Date(2026, 5, 30));

    reportResolver.resolve.mockResolvedValue(report);
    activeService.getCoverageDates.mockResolvedValue([matchingCoverage, otherCoverage]);

    const result = await resolver.resolve(route);
    expect(result.report).toBe(report);
    expect(result.existingCoverage).toEqual([otherCoverage]);
  });

  it('should retain coverage with a different start date', async () => {
    const report = {
      coverage_from_date: new Date(2026, 0, 1),
      report_code: 'Q1',
    } as unknown as BaseForm3;

    const otherCoverage = createCoverage(new Date(2026, 3, 1), new Date(2026, 5, 30));

    reportResolver.resolve.mockResolvedValue(report);
    activeService.getCoverageDates.mockResolvedValue([otherCoverage]);

    const result = await resolver.resolve(route);
    expect(result.existingCoverage).toEqual([otherCoverage]);
  });

  it('should exclude all coverage entries with the same start date', async () => {
    const startDate = new Date(2026, 0, 1);
    const report = {
      coverage_from_date: startDate,
    } as BaseForm3;

    const matchingCoverage1 = createCoverage(new Date(startDate.getTime()), new Date(2026, 2, 31));
    const matchingCoverage2 = createCoverage(new Date(startDate.getTime()), new Date(2026, 5, 30));

    reportResolver.resolve.mockResolvedValue(report);
    activeService.getCoverageDates.mockResolvedValue([matchingCoverage1, matchingCoverage2]);

    const result = await resolver.resolve(route);
    expect(result.existingCoverage).toEqual([]);
  });

  it('should resolve the report before requesting coverage dates', async () => {
    const report = {
      coverage_from_date: new Date(2026, 0, 1),
    } as BaseForm3;

    const callOrder: string[] = [];

    reportResolver.resolve.mockImplementation(async () => {
      callOrder.push('report');
      return report;
    });

    activeService.getCoverageDates.mockImplementation(async () => {
      callOrder.push('coverage');
      return [];
    });

    await resolver.resolve(route);
    expect(callOrder).toEqual(['report', 'coverage']);
  });

  it('should propagate an error when resolving the report fails', async () => {
    const error = new Error('Failed to resolve report');
    reportResolver.resolve.mockRejectedValue(error);
    await expect(resolver.resolve(route)).rejects.toThrow('Failed to resolve report');
    expect(activeService.getCoverageDates).not.toHaveBeenCalled();
  });

  it('should propagate an error when fetching coverage dates fails', async () => {
    const error = new Error('Failed to fetch coverage');
    reportResolver.resolve.mockResolvedValue(null);
    activeService.getCoverageDates.mockRejectedValue(error);
    await expect(resolver.resolve(route)).rejects.toThrow('Failed to fetch coverage');
  });
});
