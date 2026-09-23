import type { ScreenSize } from 'app/store/breakpoint.store';
import { ElectionCycle } from '../election-cycle.model';

type ElectionCycleColumn = 'office' | 'electionType' | 'electionYear' | 'startDate' | 'endDate' | 'actions';
type ColumnWidthMap = Record<ElectionCycleColumn, string>;
export const COLUMN_WIDTH_CONFIG: Partial<Record<ScreenSize, ColumnWidthMap>> = {
  sm: {
    office: '18.2%',
    electionType: '18.2%',
    electionYear: '12.3%',
    startDate: '12.3%',
    endDate: '12.3%',
    actions: '7.5%',
  },
  md: {
    office: '17.6%',
    electionType: '17.6%',
    electionYear: '17.6%',
    startDate: '20.3%',
    endDate: '20.3%',
    actions: '6.6%',
  },
  lg: {
    office: '18.9%',
    electionType: '18.9%',
    electionYear: '18.9%',
    startDate: '18.9%',
    endDate: '18.9%',
    actions: '5.5%',
  },
} as const;

export const officeOptions = [
  { label: 'House', value: 'House' },
  { label: 'Presidential', value: 'Presidential' },
  { label: 'Senate', value: 'Senate' },
];
export const electionTypeOptions = [
  { label: 'General', value: 'General' },
  { label: 'Special', value: 'Special' },
];

export type ElectionCycleForm = Omit<ElectionCycle, 'toJson' | 'id'>;
export const INITIAL_FORM_VALUE: ElectionCycleForm = {
  office: null,
  electionType: null,
  electionYear: '',
  coverage: { startDate: null, endDate: null },
};
