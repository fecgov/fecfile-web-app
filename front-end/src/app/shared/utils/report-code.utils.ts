import { DateUtils } from './date.utils';

export enum ReportCodes {
  Q1 = 'Q1',
  Q2 = 'Q2',
  Q3 = 'Q3',
  YE = 'YE',
  TER = 'TER',
  MY = 'MY',
  TwelveG = '12G',
  TwelveP = '12P',
  TwelveR = '12R',
  TwelveS = '12S',
  TwelveC = '12C',
  ThirtyG = '30G',
  ThirtyR = '30R',
  ThirtyS = '30S',
  M2 = 'M2',
  M3 = 'M3',
  M4 = 'M4',
  M5 = 'M5',
  M6 = 'M6',
  M7 = 'M7',
  M8 = 'M8',
  M9 = 'M9',
  M10 = 'M10',
  M11 = 'M11',
  M12 = 'M12',
}

export function calculateDates(
  reportCode: ReportCodes,
  year: number,
  isElectionYear: boolean,
  filingFrequency: 'Q' | 'M',
) {
  if (!reportCode) return undefined;
  if (reportCode === ReportCodes.YE) {
    return calculateYearEndDates(year, isElectionYear, filingFrequency);
  }
  const bounds = MONTH_BOUNDS_MAP[reportCode];
  if (bounds) {
    return calculateStandardDates(year, bounds[0], bounds[1]);
  }

  return undefined;
}

function calculateStandardDates(year: number, startMonth: number, endMonth: number): [Date, Date] {
  return [new Date(year, startMonth, 1), new Date(year, endMonth + 1, 0)];
}

function calculateYearEndDates(
  year: number,
  isElectionYear: boolean,
  filingFrequency: 'Q' | 'M',
): [Date | undefined, Date] {
  const adjustedYear = DateUtils.isCurrentMonthJanuary() ? year - 1 : year;

  if (isElectionYear) {
    return [undefined, new Date(year, 11, 31)];
  }
  if (filingFrequency === 'Q') {
    return [new Date(adjustedYear, 6, 1), new Date(adjustedYear, 11, 31)];
  }
  return [new Date(adjustedYear, 11, 1), new Date(adjustedYear, 11, 31)];
}

const MONTH_BOUNDS_MAP: Partial<Record<ReportCodes, [number, number]>> = {
  [ReportCodes.Q1]: [0, 2],
  [ReportCodes.Q2]: [3, 5],
  [ReportCodes.Q3]: [6, 8],
  [ReportCodes.MY]: [0, 5],
  [ReportCodes.M2]: [0, 0],
  [ReportCodes.M3]: [1, 1],
  [ReportCodes.M4]: [2, 2],
  [ReportCodes.M5]: [3, 3],
  [ReportCodes.M6]: [4, 4],
  [ReportCodes.M7]: [5, 5],
  [ReportCodes.M8]: [6, 6],
  [ReportCodes.M9]: [7, 7],
  [ReportCodes.M10]: [8, 8],
  [ReportCodes.M11]: [9, 9],
  [ReportCodes.M12]: [10, 10],
};

export const monthlyElectionYearReportCodes: ReportCodes[] = [
  ReportCodes.M2,
  ReportCodes.M3,
  ReportCodes.M4,
  ReportCodes.M5,
  ReportCodes.M6,
  ReportCodes.M7,
  ReportCodes.M8,
  ReportCodes.M9,
  ReportCodes.M10,
  ReportCodes.TwelveG,
  ReportCodes.ThirtyG,
  ReportCodes.YE,
  ReportCodes.TER,
];
export const monthlyNonElectionYearReportCodes: ReportCodes[] = [
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
];
export const quarterlyElectionYearReportCodes: ReportCodes[] = [
  ReportCodes.Q1,
  ReportCodes.Q2,
  ReportCodes.Q3,
  ReportCodes.TwelveG,
  ReportCodes.ThirtyG,
  ReportCodes.YE,
  ReportCodes.TwelveP,
  ReportCodes.TwelveR,
  ReportCodes.TwelveS,
  ReportCodes.TwelveC,
  ReportCodes.ThirtyR,
  ReportCodes.ThirtyS,
  ReportCodes.TER,
];
export const quarterlyNonElectionYearReportCodes: ReportCodes[] = [
  ReportCodes.MY,
  ReportCodes.YE,
  ReportCodes.TwelveP,
  ReportCodes.TwelveR,
  ReportCodes.TwelveS,
  ReportCodes.TwelveC,
  ReportCodes.ThirtyR,
  ReportCodes.ThirtyS,
  ReportCodes.TER,
];

export const electionReportCodes: ReportCodes[] = [
  ReportCodes.ThirtyG,
  ReportCodes.ThirtyR,
  ReportCodes.ThirtyS,
  ReportCodes.TwelveC,
  ReportCodes.TwelveG,
  ReportCodes.TwelveP,
  ReportCodes.TwelveR,
  ReportCodes.TwelveS,
];
