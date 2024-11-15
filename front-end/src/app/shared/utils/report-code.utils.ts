import { DateUtils } from './date.utils';

export enum F3xReportCodes {
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
  reportCode: F3xReportCodes,
): ((year: number, isElectionYear: boolean, filingFrequency: string) => [Date, Date]) | undefined {
  switch (reportCode) {
    case F3xReportCodes.Q1: {
      return createCoverageFunction(0, 1, 2, 31);
    }
    case F3xReportCodes.Q2: {
      return createCoverageFunction(3, 1, 5, 30);
    }
    case F3xReportCodes.Q3: {
      return createCoverageFunction(6, 1, 8, 30);
    }
    case F3xReportCodes.YE: {
      return getYearEndCoverageDates;
    }
    case F3xReportCodes.MY: {
      return createCoverageFunction(0, 1, 5, 30);
    }
    case F3xReportCodes.M2: {
      return createCoverageFunction(0, 1, 0, 31);
    }
    case F3xReportCodes.M3: {
      return createCoverageFunction(1, 1, 1, 29);
    }
    case F3xReportCodes.M4: {
      return createCoverageFunction(2, 1, 2, 31);
    }
    case F3xReportCodes.M5: {
      return createCoverageFunction(3, 1, 3, 30);
    }
    case F3xReportCodes.M6: {
      return createCoverageFunction(4, 1, 4, 31);
    }
    case F3xReportCodes.M7: {
      return createCoverageFunction(5, 1, 5, 30);
    }
    case F3xReportCodes.M8: {
      return createCoverageFunction(6, 1, 6, 31);
    }
    case F3xReportCodes.M9: {
      return createCoverageFunction(7, 1, 7, 31);
    }
    case F3xReportCodes.M10: {
      return createCoverageFunction(8, 1, 8, 30);
    }
    case F3xReportCodes.M11: {
      return createCoverageFunction(9, 1, 9, 31);
    }
    case F3xReportCodes.M12: {
      return createCoverageFunction(10, 1, 10, 30);
    }
    default:
      return undefined;
  }
}

function createCoverageFunction(
  startMonth: number,
  startDayOfMonth: number,
  endMonth: number,
  endDayOfMonth: number,
): (year: number, isElectionYear: boolean, filingFrequency: string) => [Date, Date] {
  return (year: number) => {
    return [new Date(year, startMonth, startDayOfMonth), new Date(year, endMonth, endDayOfMonth)];
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

export const monthlyElectionYearReportCodes: F3xReportCodes[] = [
  F3xReportCodes.M2,
  F3xReportCodes.M3,
  F3xReportCodes.M4,
  F3xReportCodes.M5,
  F3xReportCodes.M6,
  F3xReportCodes.M7,
  F3xReportCodes.M8,
  F3xReportCodes.M9,
  F3xReportCodes.M10,
  F3xReportCodes.TwelveG,
  F3xReportCodes.ThirtyG,
  F3xReportCodes.YE,
  F3xReportCodes.TER,
];
export const monthlyNonElectionYearReportCodes: F3xReportCodes[] = [
  F3xReportCodes.M2,
  F3xReportCodes.M3,
  F3xReportCodes.M4,
  F3xReportCodes.M5,
  F3xReportCodes.M6,
  F3xReportCodes.M7,
  F3xReportCodes.M8,
  F3xReportCodes.M9,
  F3xReportCodes.M10,
  F3xReportCodes.M11,
  F3xReportCodes.M12,
  F3xReportCodes.YE,
  F3xReportCodes.TER,
];
export const quarterlyElectionYearReportCodes: F3xReportCodes[] = [
  F3xReportCodes.Q1,
  F3xReportCodes.Q2,
  F3xReportCodes.Q3,
  F3xReportCodes.TwelveG,
  F3xReportCodes.ThirtyG,
  F3xReportCodes.YE,
  F3xReportCodes.TwelveP,
  F3xReportCodes.TwelveR,
  F3xReportCodes.TwelveS,
  F3xReportCodes.TwelveC,
  F3xReportCodes.ThirtyR,
  F3xReportCodes.ThirtyS,
  F3xReportCodes.TER,
];
export const quarterlyNonElectionYearReportCodes: F3xReportCodes[] = [
  F3xReportCodes.MY,
  F3xReportCodes.YE,
  F3xReportCodes.TwelveP,
  F3xReportCodes.TwelveR,
  F3xReportCodes.TwelveS,
  F3xReportCodes.TwelveC,
  F3xReportCodes.ThirtyR,
  F3xReportCodes.ThirtyS,
  F3xReportCodes.TER,
];

export const electionReportCodes: F3xReportCodes[] = [
  F3xReportCodes.ThirtyG,
  F3xReportCodes.ThirtyR,
  F3xReportCodes.ThirtyS,
  F3xReportCodes.TwelveC,
  F3xReportCodes.TwelveG,
  F3xReportCodes.TwelveP,
  F3xReportCodes.TwelveR,
  F3xReportCodes.TwelveS,
];
