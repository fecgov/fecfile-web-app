import { inject, runInInjectionContext, Injector } from '@angular/core';
import { ActivatedRouteSnapshot, RedirectCommand } from '@angular/router';
import { reportResolver } from 'app/shared/resolvers/report.resolver';
import { FORM_3_SERVICE } from 'app/shared/services/base-form-3.service';
import { BaseForm3 } from 'app/shared/models/reports/base-form-3';
import { Form3X } from '../models/reports/form-3x.model';
import { Form3 } from '../models/reports/form-3.model';
import { getLines as getF3XLines } from 'app/reports/f3-shared/summaries/report-detailed-summary/f3x-detailed-line-summaries';
import { getLines as getF3Lines } from 'app/reports/f3-shared/summaries/report-detailed-summary/f3-detailed-line-summaries';
import { getF3LineSummaries, getF3XLineSummaries } from 'app/reports/f3-shared/summaries/report-summary/lines';
import { ElectionCycleService } from 'app/tools/election-cycle/election-cycle.service';

export const sharedForm3Resolver = async (route: ActivatedRouteSnapshot) => {
  const injector = inject(Injector);
  const activeService = inject(FORM_3_SERVICE);
  let existingCoverage = await activeService.getCoverageDates();
  let report: BaseForm3 | null = null;
  const reportId = route.paramMap.get('reportId');
  if (reportId) {
    const resolvedReport = await runInInjectionContext(injector, () => reportResolver(route));
    if (resolvedReport instanceof RedirectCommand) return resolvedReport;
    report = resolvedReport as BaseForm3;
    existingCoverage = existingCoverage.filter(
      (item) => item.coverage_from_date?.getTime() !== report!.coverage_from_date?.getTime(),
    );
  }

  return { report, existingCoverage };
};

export const f3DetailedSummaryResolver = async (route: ActivatedRouteSnapshot) => {
  const ecService = inject(ElectionCycleService);
  const injector = inject(Injector);
  const resolvedReport = await runInInjectionContext(injector, () => reportResolver(route));
  if (resolvedReport instanceof RedirectCommand) return resolvedReport;
  const report = resolvedReport as Form3;
  const { electionCycle, nextElectionCycle } = await getElectionCycles(report, ecService);

  return {
    report,
    electionCycle,
    nextElectionCycle,
    detailedLines: getF3Lines(report as Form3),
  };
};

export const f3XDetailedSummaryResolver = async (route: ActivatedRouteSnapshot) => {
  const injector = inject(Injector);
  const resolvedReport = await runInInjectionContext(injector, () => reportResolver(route));
  if (resolvedReport instanceof RedirectCommand) return resolvedReport;
  const report = resolvedReport as Form3X;
  return { report, detailedLines: getF3XLines(report) };
};

export const f3SummaryResolver = async (route: ActivatedRouteSnapshot) => {
  const ecService = inject(ElectionCycleService);
  const injector = inject(Injector);
  const resolvedReport = await runInInjectionContext(injector, () => reportResolver(route));
  if (resolvedReport instanceof RedirectCommand) return resolvedReport;
  const report = resolvedReport as Form3;
  const { electionCycle, nextElectionCycle } = await getElectionCycles(report, ecService);
  return { report, electionCycle, nextElectionCycle, lines: getF3LineSummaries(report) };
};

export const f3XSummaryResolver = async (route: ActivatedRouteSnapshot) => {
  const injector = inject(Injector);
  const resolvedReport = await runInInjectionContext(injector, () => reportResolver(route));
  if (resolvedReport instanceof RedirectCommand) return resolvedReport;
  const report = resolvedReport as Form3X;
  return { report, lines: getF3XLineSummaries(report) };
};

const getElectionCycles = async (report: Form3, ecService: ElectionCycleService) => {
  const ecPromises = [ecService.get(report.electionCycleId)];
  if (report.nextElectionCycleId !== null) ecPromises.push(ecService.get(report.nextElectionCycleId));
  const cycles = await Promise.all(ecPromises);
  report.electionCycle = cycles[0];
  report.nextElectionCycle = report.nextElectionCycleId !== null ? cycles[1] : null;
  return { electionCycle: report.electionCycle, nextElectionCycle: report.nextElectionCycle };
};
