import { Injector, runInInjectionContext } from '@angular/core';
import { ActivatedRouteSnapshot, convertToParamMap, RedirectCommand, Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { reportResolver } from './report.resolver';
import { Report } from '../models/reports/report.model';
import { ReportService } from '../services/report.service';

describe('reportResolver', () => {
  let injector: Injector;
  let router: Router;
  let route: ActivatedRouteSnapshot;
  let setActiveReportById: ReturnType<typeof vi.fn>;

  const createRoute = (reportId: string | null = null): ActivatedRouteSnapshot =>
    ({
      paramMap: convertToParamMap(reportId ? { reportId } : {}),
    }) as ActivatedRouteSnapshot;

  const resolve = () => runInInjectionContext(injector, () => reportResolver(route));

  beforeEach(() => {
    setActiveReportById = vi.fn();

    TestBed.configureTestingModule({
      providers: [
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

  it('should resolve the report when a report ID is provided', async () => {
    const report = { id: 'report-1' } as Report;

    setActiveReportById.mockResolvedValue(report);

    const result = await resolve();

    expect(result).toBe(report);
    expect(setActiveReportById).toHaveBeenCalledOnce();
    expect(setActiveReportById).toHaveBeenCalledWith('report-1');
  });

  it('should redirect to reports when no report ID is provided', async () => {
    route = createRoute();

    const result = await resolve();

    expect(result).toBeInstanceOf(RedirectCommand);
    expect((result as RedirectCommand).redirectTo).toEqual(router.parseUrl('/reports'));
    expect(setActiveReportById).not.toHaveBeenCalled();
  });

  it('should redirect to reports when resolving the report fails', async () => {
    setActiveReportById.mockRejectedValue(new Error('Report not found'));

    const result = await resolve();

    expect(result).toBeInstanceOf(RedirectCommand);
    expect((result as RedirectCommand).redirectTo).toEqual(router.parseUrl('/reports'));
    expect(setActiveReportById).toHaveBeenCalledOnce();
    expect(setActiveReportById).toHaveBeenCalledWith('report-1');
  });
});
