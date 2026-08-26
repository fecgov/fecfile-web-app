import { PathKind, validateTree, SchemaPathTree, FieldTree } from '@angular/forms/signals';
import { StringDate } from 'app/shared/components/signal-inputs/date-input/date.input';
import { BaseForm3, CoverageDates, ReportTypeCategories } from 'app/shared/models/reports/base-form-3';
import { StateCode } from 'app/shared/utils/label.utils';
import { Coverage, ReportCodes } from 'app/shared/utils/report-code.utils';
import { DateUtils } from 'app/shared/utils/date.utils';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { Signal } from '@angular/core';
import { F3xFormTypes, FilingFrequency, Form3X } from 'app/shared/models/reports/form-3x.model';
import { F3FormTypes, Form3 } from 'app/shared/models/reports/form-3.model';

export interface SharedForm3Data {
  coverages: Coverage;
  filingFrequency: FilingFrequency | null;
  reportCode: ReportCodes | null;
  reportTypeCategory: ReportTypeCategories | null;
  election: {
    state: StateCode | null;
    date: StringDate;
  };
}

export function deserializeBaseForm3(baseForm3: BaseForm3): SharedForm3Data {
  return {
    coverages: {
      from: baseForm3.coverage_from_date ?? null,
      to: baseForm3.coverage_through_date ?? null,
    },
    filingFrequency: baseForm3 instanceof Form3X ? (baseForm3.filing_frequency ?? null) : null,
    reportCode: (baseForm3.report_code as ReportCodes) ?? null,
    reportTypeCategory: baseForm3.report_type_category ?? null,
    election: {
      state: (baseForm3.state_of_election as StateCode) ?? null,
      date: baseForm3.date_of_election ?? null,
    },
  };
}

export function serializeForm3X(data: SharedForm3Data, originalFormType: F3xFormTypes): Form3X {
  const partial: Partial<Form3X> = {
    coverage_from_date: data.coverages.from as Date,
    coverage_through_date: data.coverages.to as Date,
    filing_frequency: data.filingFrequency!,
    report_code: data.reportCode!,
    report_type_category: data.reportTypeCategory!,
    state_of_election: data.election.state ?? undefined,
    date_of_election: (data.election.date as Date) ?? undefined,
    form_type: data.reportCode === ReportCodes.TER ? F3xFormTypes.F3XT : originalFormType,
  };
  return Form3X.fromJSON(partial);
}

export function serializeForm3(data: SharedForm3Data, originalFormType: F3FormTypes): Form3 {
  const partial: Partial<Form3> = {
    coverage_from_date: data.coverages.from as Date,
    coverage_through_date: data.coverages.to as Date,
    report_code: data.reportCode!,
    report_type_category: data.reportTypeCategory!,
    state_of_election: data.election.state ?? undefined,
    date_of_election: (data.election.date as Date) ?? undefined,
    form_type: data.reportCode === ReportCodes.TER ? F3FormTypes.F3T : originalFormType,
  };
  return Form3.fromJSON(partial);
}

export function validateNonOverlappingCoverage(
  coverageNode: SchemaPathTree<Coverage, PathKind.Child>,
  existingCoverageSignal: Signal<CoverageDates[] | undefined>,
) {
  validateTree(coverageNode, ({ value, fieldTree }) => {
    const { from, to } = value();
    const existing = existingCoverageSignal();

    if (!from || !to || !existing?.length || typeof from === 'string' || typeof to === 'string') {
      return null;
    }

    const fecDatePipe = new FecDatePipe();

    const getCoverageOverlapError = (collision: CoverageDates) => ({
      kind: 'coverage-overlap',
      message:
        `You have entered coverage dates that overlap the coverage dates of the following report: ` +
        `${collision.report_code_label} ` +
        `${fecDatePipe.transform(collision.coverage_from_date)} - ` +
        `${fecDatePipe.transform(collision.coverage_through_date)}`,
    });

    const surrounding = existing.find((coverage) => {
      const { coverage_from_date: cFrom, coverage_through_date: cThrough } = coverage;
      return cFrom && cThrough && from <= cFrom && to >= cThrough;
    });

    if (surrounding) {
      const err = getCoverageOverlapError(surrounding);
      return { ...err, fieldTree };
    }

    const isWithinCoverage = (dateVal: Date) =>
      existing.find((cov) => DateUtils.isWithin(dateVal, cov.coverage_from_date, cov.coverage_through_date));

    const fromCollision = isWithinCoverage(from);
    const throughCollision = isWithinCoverage(to);
    if (!fromCollision && !throughCollision) return null;
    const targetFieldTree = resolveTargetFieldTree(!!fromCollision, !!throughCollision, fieldTree);
    const collision = fromCollision ?? throughCollision!;

    return { ...getCoverageOverlapError(collision), fieldTree: targetFieldTree };
  });
}

function resolveTargetFieldTree(hasFrom: boolean, hasThrough: boolean, rootFieldTree: FieldTree<Coverage>) {
  if (hasFrom && hasThrough) return rootFieldTree;
  if (hasFrom) return rootFieldTree.from;
  return rootFieldTree.to;
}
