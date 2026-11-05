import { TemplateRef } from '@angular/core';
import { DateUtils } from 'app/shared/utils/date.utils';
import { BreakpointStore, ScreenSize } from 'app/store/breakpoint.store';
import type { ColumnDefinition, TableBodyContext } from 'app/shared/components/table/table.component';
import type { BaseForm3 } from 'app/shared/models/reports/base-form-3';
import type { Form3 } from 'app/shared/models/reports/form-3.model';
import type { LineSummary } from 'app/shared/models/reports/lines.model';
import { ElectionCycle } from 'app/tools/election-cycle/election-cycle.model';

type Form3Column = 'lineNumber' | 'description' | 'thisPeriod' | 'valueToDate';
type Form3SColumn = 'lineNumber' | 'description' | 'thisPeriod' | 'valueToDate' | 'electionCycleTotal';
type Form3ColumnWidthMap = Record<Form3Column, string>;
type Form3SColumnWidthMap = Record<Form3SColumn, string>;
const FORM_3_COLUMN_WIDTH_CONFIG: Partial<Record<ScreenSize, Form3ColumnWidthMap>> = {
  sm: {
    lineNumber: '0',
    description: 'remainder',
    thisPeriod: '130px',
    valueToDate: '162px',
  },
  md: {
    lineNumber: '72px',
    description: 'remainder',
    thisPeriod: '130px',
    valueToDate: '162px',
  },
  lg: {
    lineNumber: '72px',
    description: 'remainder',
    thisPeriod: '130px',
    valueToDate: '162px',
  },
  xl: {
    lineNumber: '72px',
    description: 'remainder',
    thisPeriod: '130px',
    valueToDate: '162px',
  },
  xxl: {
    lineNumber: '72px',
    description: 'remainder',
    thisPeriod: '130px',
    valueToDate: '162px',
  },
} as const;
const FORM_3S_COLUMN_WIDTH_CONFIG: Partial<Record<ScreenSize, Form3SColumnWidthMap>> = {
  sm: {
    lineNumber: '8.45%',
    description: '37.09%',
    thisPeriod: '15.26%',
    valueToDate: '19.6%',
    electionCycleTotal: '19.6%',
  },
  md: {
    lineNumber: '7.95%',
    description: '26.14%%',
    thisPeriod: '18.47%',
    valueToDate: '23.72%',
    electionCycleTotal: '23.72%',
  },
  lg: {
    lineNumber: '8.67%',
    description: '36.87%',
    thisPeriod: '15.26%',
    valueToDate: '19.6%',
    electionCycleTotal: '19.6%',
  },
  xl: {
    lineNumber: '8.67%',
    description: '36.87%',
    thisPeriod: '15.26%',
    valueToDate: '19.6%',
    electionCycleTotal: '19.6%',
  },
  xxl: {
    lineNumber: '7%',
    description: '48.88%',
    thisPeriod: '12.38%',
    valueToDate: '15.87%',
    electionCycleTotal: '15.87%',
  },
} as const;

export function buildColumns(
  report: BaseForm3,
  type: 'F3' | 'F3X' | 'F3S',
  descriptionTemplate: TemplateRef<TableBodyContext<LineSummary>>,
  breakpointStore: BreakpointStore,
  electionCycle?: ElectionCycle,
) {
  const widths = breakpointStore.getColumnWidths(
    type === 'F3S' ? FORM_3S_COLUMN_WIDTH_CONFIG : FORM_3_COLUMN_WIDTH_CONFIG,
  );

  const columns: ColumnDefinition<LineSummary>[] = [
    { field: 'lineNumber', header: 'Line', width: widths.lineNumber },
    {
      field: 'description',
      header: 'Description',
      bodyTpl: descriptionTemplate,
    },
    { field: 'thisPeriod', header: 'This Period', width: widths.thisPeriod, pipes: ['currency'] },
    {
      field: 'valueToDate',
      header: valueToDateTitle(electionCycle, type),
      width: widths.valueToDate,
      pipes: ['currency'],
    },
  ];
  if (type === 'F3S') {
    columns.push({
      field: 'electionCycleTotal',
      header: electionTotalTitle(electionCycle!),
      width: (widths as Form3SColumnWidthMap).electionCycleTotal,
      pipes: ['currency'],
    });
  }
  return columns;
}

function valueToDateTitle(electionCycle: ElectionCycle | undefined, type: 'F3' | 'F3X' | 'F3S') {
  switch (type) {
    case 'F3':
      return 'Election Cycle-to-Date';
    case 'F3X':
      return 'Calendar Year-to-Date';
    case 'F3S':
      return `Election Cycle Total as of ${DateUtils.convertDateToSlashFormat(electionCycle?.coverage.startDate)}`;
  }
}
function electionTotalTitle(electionCycle: ElectionCycle): string {
  return `Total for ${DateUtils.convertDateToSlashFormat(electionCycle.coverage.startDate)} through ${DateUtils.convertDateToSlashFormat(electionCycle.coverage.endDate)}`;
}
