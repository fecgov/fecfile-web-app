import type { BreakpointStore, ScreenSize } from 'app/store/breakpoint.store';

type ElectionCycleColumn = 'office' | 'electionType' | 'electionYear' | 'startDate' | 'endDate' | 'actions';
type ColumnWidthMap = Record<ElectionCycleColumn, string>;
const COLUMN_WIDTH_CONFIG: Partial<Record<ScreenSize, ColumnWidthMap>> = {
  sm: {
    office: '18.2%',
    electionType: '18.2%',
    electionYear: '12.3%',
    startDate: '22.5%',
    endDate: '22.5%',
    actions: '6.3%',
  },
  md: {
    office: '17.6%',
    electionType: '17.6%',
    electionYear: '17.6%',
    startDate: '18.3%',
    endDate: '18.2%',
    actions: '10.8%',
  },
  lg: {
    office: '17.9%',
    electionType: '17.9%',
    electionYear: '17.9%',
    startDate: '18.6%',
    endDate: '18.6%',
    actions: '9.1%',
  },
  xl: {
    office: '17.9%',
    electionType: '17.9%',
    electionYear: '17.9%',
    startDate: '18.6%',
    endDate: '18.6%',
    actions: '9.1%',
  },
  xxl: {
    office: '18.1%',
    electionType: '18.1%',
    electionYear: '18.1%',
    startDate: '19.2%',
    endDate: '19.2%',
    actions: '7.5%',
  },
} as const;

export function electionColumns(breakpointStore: BreakpointStore) {
  const widths = breakpointStore.getColumnWidths(COLUMN_WIDTH_CONFIG);
  const isSmall = breakpointStore.screenSize() === 'sm';
  return [
    { field: 'office', header: 'Office', width: widths.office },
    { field: 'electionType', header: isSmall ? 'Type' : 'Election Type', width: widths.electionType },
    { field: 'electionYear', header: isSmall ? 'Year' : 'Election Year', width: widths.electionYear },
    { field: 'startDate', header: 'Start Date', width: widths.startDate },
    { field: 'endDate', header: 'End Date', width: widths.endDate },
    { field: '', header: 'Actions', width: widths.actions },
  ];
}
