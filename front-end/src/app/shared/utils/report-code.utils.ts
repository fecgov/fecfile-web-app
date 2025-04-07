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

export function getCoverageDatesFunction(
  reportCode: ReportCodes,
): ((year: number, isElectionYear: boolean, filingFrequency: string) => [Date, Date]) | undefined {
  switch (reportCode) {
    case ReportCodes.Q1: {
      return createCoverageFunction(0, 2);
    }
    case ReportCodes.Q2: {
      return createCoverageFunction(3, 5);
    }
    case ReportCodes.Q3: {
      return createCoverageFunction(6, 8);
    }
    case ReportCodes.YE: {
      return getYearEndCoverageDates;
    }
    case ReportCodes.MY: {
      return createCoverageFunction(0, 5);
    }
    case ReportCodes.M2: {
      return createCoverageFunction(0, 0);
    }
    case ReportCodes.M3: {
      return createCoverageFunction(1, 1);
    }
    case ReportCodes.M4: {
      return createCoverageFunction(2, 2);
    }
    case ReportCodes.M5: {
      return createCoverageFunction(3, 3);
    }
    case ReportCodes.M6: {
      return createCoverageFunction(4, 4);
    }
    case ReportCodes.M7: {
      return createCoverageFunction(5, 5);
    }
    case ReportCodes.M8: {
      return createCoverageFunction(6, 6);
    }
    case ReportCodes.M9: {
      return createCoverageFunction(7, 7);
    }
    case ReportCodes.M10: {
      return createCoverageFunction(8, 8);
    }
    case ReportCodes.M11: {
      return createCoverageFunction(9, 9);
    }
    case ReportCodes.M12: {
      return createCoverageFunction(10, 10);
    }
    default:
      return undefined;
  }
}

function createCoverageFunction(
  startMonth: number,
  endMonth: number,
): (year: number, isElectionYear: boolean, filingFrequency: string) => [Date, Date] {
  return (year: number) => {
    return [new Date(year, startMonth, 1), new Date(year, endMonth + 1, 0)];
  };
}

function getYearEndCoverageDates(year: number, isElectionYear: boolean, filingFrequency: string): [Date, Date] {
  year = DateUtils.isCurrentMonthJanuary() ? year - 1 : year;
  if (isElectionYear) {
    return [new Date(year, 9, 1), new Date(year, 11, 31)];
  } else if (filingFrequency === 'Q') {
    return [new Date(year, 6, 1), new Date(year, 11, 31)];
  }
  return [new Date(year, 11, 1), new Date(year, 11, 31)];
}

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
