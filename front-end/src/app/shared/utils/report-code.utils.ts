import { StringDate } from '../components/signal-inputs/date-input/date.input';
import { FilingFrequency } from '../models/reports/form-3x.model';
import { DateUtils } from './date.utils';
import type { PrimeOptions } from './label.utils';

export interface Coverage {
  from: StringDate;
  to: StringDate;
}

type Form3Situation =
  | 'Form3_Quarterly_Election'
  | 'Form3_Quarterly_NonElection'
  | 'Form3X_Quarterly_Election'
  | 'Form3X_Quarterly_NonElection'
  | 'Form3X_Monthly_Election'
  | 'Form3X_Monthly_NonElection';

export const filingFrequencyOptions = [
  { label: 'Quarterly', value: 'Q' },
  { label: 'Monthly', value: 'M' },
] as const satisfies PrimeOptions;

export const ReportCodes = {
  Q1: 'Q1',
  Q2: 'Q2',
  Q3: 'Q3',
  YE: 'YE',
  TER: 'TER',
  MY: 'MY',
  '12G': '12G',
  '12P': '12P',
  '12R': '12R',
  '12S': '12S',
  '12C': '12C',
  '30G': '30G',
  '30R': '30R',
  '30S': '30S',
  M2: 'M2',
  M3: 'M3',
  M4: 'M4',
  M5: 'M5',
  M6: 'M6',
  M7: 'M7',
  M8: 'M8',
  M9: 'M9',
  M10: 'M10',
  M11: 'M11',
  M12: 'M12',
} as const;
export type ReportCodes = (typeof ReportCodes)[keyof typeof ReportCodes];

export function getCoverageDates(
  reportCode: ReportCodes | null,
  isElectionYear: boolean,
  filingFrequency: FilingFrequency | null,
): Coverage {
  const year = new Date().getFullYear()
  if (reportCode === null || filingFrequency === null) return { from: null, to: null };
  if (reportCode === ReportCodes.YE) {
    const adjustedYear = DateUtils.isCurrentMonthJanuary() ? year - 1 : year;
    if (isElectionYear) {
      return { from: null, to: new Date(adjustedYear, 11, 31) };
    }
    if (filingFrequency === 'Q') {
      return { from: new Date(adjustedYear, 6, 1), to: new Date(adjustedYear, 11, 31) };
    }
    return { from: new Date(adjustedYear, 11, 1), to: new Date(adjustedYear, 11, 31) };
  }

  const staticDateMap: Partial<Record<ReportCodes, Coverage>> = {
    [ReportCodes.Q1]: { from: new Date(year, 0, 1), to: new Date(year, 3, 0) },
    [ReportCodes.Q2]: { from: new Date(year, 3, 1), to: new Date(year, 6, 0) },
    [ReportCodes.Q3]: { from: new Date(year, 6, 1), to: new Date(year, 9, 0) },
    [ReportCodes.MY]: { from: new Date(year, 0, 1), to: new Date(year, 6, 0) },
    [ReportCodes.M2]: { from: new Date(year, 0, 1), to: new Date(year, 1, 0) },
    [ReportCodes.M3]: { from: new Date(year, 1, 1), to: new Date(year, 2, 0) },
    [ReportCodes.M4]: { from: new Date(year, 2, 1), to: new Date(year, 3, 0) },
    [ReportCodes.M5]: { from: new Date(year, 3, 1), to: new Date(year, 4, 0) },
    [ReportCodes.M6]: { from: new Date(year, 4, 1), to: new Date(year, 5, 0) },
    [ReportCodes.M7]: { from: new Date(year, 5, 1), to: new Date(year, 6, 0) },
    [ReportCodes.M8]: { from: new Date(year, 6, 1), to: new Date(year, 7, 0) },
    [ReportCodes.M9]: { from: new Date(year, 7, 1), to: new Date(year, 8, 0) },
    [ReportCodes.M10]: { from: new Date(year, 8, 1), to: new Date(year, 9, 0) },
    [ReportCodes.M11]: { from: new Date(year, 9, 1), to: new Date(year, 10, 0) },
    [ReportCodes.M12]: { from: new Date(year, 10, 1), to: new Date(year, 11, 0) },
  };
  return staticDateMap[reportCode] ?? { from: null, to: null };
}

export function getReportCodes(isElectionYear: boolean, filingFrequency: FilingFrequency | null, isForm3X: boolean) {
  if (filingFrequency === null) return new Set<ReportCodes>();
  const formPart = isForm3X ? 'Form3X' : 'Form3';
  const freqPart = filingFrequency === 'M' ? 'Monthly' : 'Quarterly';
  const electPart = isElectionYear ? 'Election' : 'NonElection';
  const situationKey = `${formPart}_${freqPart}_${electPart}` as Form3Situation;
  return new Set(SITUATION_REPORT_MAP[situationKey]);
}

const SITUATION_REPORT_MAP: Record<Form3Situation, ReportCodes[]> = {
  Form3_Quarterly_Election: [
    ReportCodes.Q1,
    ReportCodes.Q2,
    ReportCodes.Q3,
    ReportCodes['12G'],
    ReportCodes['30G'],
    ReportCodes.YE,
    ReportCodes['12P'],
    ReportCodes['12R'],
    ReportCodes['12S'],
    ReportCodes['12C'],
    ReportCodes['30R'],
    ReportCodes['30S'],
    ReportCodes.TER,
  ],
  Form3_Quarterly_NonElection: [
    ReportCodes.Q1,
    ReportCodes.Q2,
    ReportCodes.Q3,
    ReportCodes.YE,
    ReportCodes['12P'],
    ReportCodes['12R'],
    ReportCodes['12S'],
    ReportCodes['12C'],
    ReportCodes['30R'],
    ReportCodes['30S'],
    ReportCodes.TER,
  ],
  Form3X_Quarterly_Election: [
    ReportCodes.Q1,
    ReportCodes.Q2,
    ReportCodes.Q3,
    ReportCodes['12G'],
    ReportCodes['30G'],
    ReportCodes.YE,
    ReportCodes['12P'],
    ReportCodes['12R'],
    ReportCodes['12S'],
    ReportCodes['12C'],
    ReportCodes['30R'],
    ReportCodes['30S'],
    ReportCodes.TER,
  ],
  Form3X_Quarterly_NonElection: [
    ReportCodes.MY,
    ReportCodes.YE,
    ReportCodes['12P'],
    ReportCodes['12R'],
    ReportCodes['12S'],
    ReportCodes['12C'],
    ReportCodes['30R'],
    ReportCodes['30S'],
    ReportCodes.TER,
  ],
  Form3X_Monthly_Election: [
    ReportCodes.M2,
    ReportCodes.M3,
    ReportCodes.M4,
    ReportCodes.M5,
    ReportCodes.M6,
    ReportCodes.M7,
    ReportCodes.M8,
    ReportCodes.M9,
    ReportCodes.M10,
    ReportCodes['12G'],
    ReportCodes['30G'],
    ReportCodes.YE,
    ReportCodes.TER,
  ],
  Form3X_Monthly_NonElection: [
    ReportCodes.M2,
    ReportCodes.M3,
    ReportCodes.M4,
    ReportCodes.M5,
    ReportCodes.M6,
    ReportCodes.M7,
    ReportCodes.M8,
    ReportCodes.M9,
    ReportCodes.M10,
    ReportCodes.M11,
    ReportCodes.M12,
    ReportCodes.YE,
    ReportCodes.TER,
  ],
};

export const electionReportCodes = new Set<ReportCodes>([
  ReportCodes['30G'],
  ReportCodes['30R'],
  ReportCodes['30S'],
  ReportCodes['12C'],
  ReportCodes['12G'],
  ReportCodes['12P'],
  ReportCodes['12R'],
  ReportCodes['12S'],
]);

/**
 * FECFILE-2500
 * ELECTION YEAR
 *   current date is between Feb 1 – Dec 31 of an even-numbered year
 *   current date is between Jan 1 – Jan 31 of an odd-numbered year
 *
 * NON-ELECTION YEAR
 *   current date is between Feb 1 – Dec 31 of an odd-numbered year
 *   current date is between Jan 1 – Jan 31 of an even-numbered year
 * @returns F3xReportTypeCategories
 */
export function getDefaultTypeCategory() {
  const isEvenYear = DateUtils.currentYear % 2 === 0;
  const isJanuary = new Date().getMonth() === 0;
  return (isEvenYear && isJanuary) || (!isEvenYear && !isJanuary) ? 'NON_ELECTION_YEAR' : 'ELECTION_YEAR';
}
