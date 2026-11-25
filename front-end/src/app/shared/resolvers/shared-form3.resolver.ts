import { inject, runInInjectionContext, Injector } from '@angular/core';
import { ActivatedRouteSnapshot, RedirectCommand } from '@angular/router';
import { reportResolver } from 'app/shared/resolvers/report.resolver';
import { FORM_3_SERVICE } from 'app/shared/services/base-form-3.service';
import { ElectionCycleService } from 'app/tools/election-cycle/election-cycle.service';
import type { BaseForm3 } from 'app/shared/models/reports/base-form-3';
import type { Form3 } from '../models/reports/form-3.model';

export const sharedForm3Resolver = async (route: ActivatedRouteSnapshot) => {
  const injector = inject(Injector);
  const resolvedReport = await runInInjectionContext(injector, () => reportResolver(route));
  if (resolvedReport instanceof RedirectCommand) return resolvedReport;
  return resolvedReport as BaseForm3;
};

export const form3CoverageResolver = async (route: ActivatedRouteSnapshot) => {
  const injector = inject(Injector);
  const activeService = inject(FORM_3_SERVICE);
  let existingCoverage = await activeService.getCoverageDates();
  let report: BaseForm3 | RedirectCommand | null = null;
  const reportId = route.paramMap.get('reportId');
  if (reportId) {
    report = await runInInjectionContext(injector, () => sharedForm3Resolver(route));
    if (report instanceof RedirectCommand) return report;
    existingCoverage = existingCoverage.filter(
      (item) => item.coverage_from_date?.getTime() !== (report as BaseForm3).coverage_from_date?.getTime(),
    );
  }

  return { report, existingCoverage };
};

export const form3ElectionCycleResolver = async (route: ActivatedRouteSnapshot) => {
  const ecService = inject(ElectionCycleService);
  const injector = inject(Injector);
  const report = await runInInjectionContext(injector, () => sharedForm3Resolver(route));
  if (report instanceof RedirectCommand) return report;
  return await getElectionCycles(report as Form3, ecService);
};

const getElectionCycles = async (report: Form3, ecService: ElectionCycleService) => {
  const ecPromises = [ecService.get(report.electionCycleId)];
  if (report.nextElectionCycleId !== null) ecPromises.push(ecService.get(report.nextElectionCycleId));
  const cycles = await Promise.all(ecPromises);
  report.electionCycle = cycles[0];
  report.nextElectionCycle = report.nextElectionCycleId !== null ? cycles[1] : null;
  return report;
};
