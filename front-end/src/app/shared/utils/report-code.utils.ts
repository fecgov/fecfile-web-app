import { Pipe, PipeTransform } from '@angular/core';

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

export class F3xReportCode {
  code: string;
  label: string;
  coverageDatesFunction: ((year: number, isElectionYear: boolean, filingFrequency: string) => [Date, Date]) | undefined;

  constructor(
    code: string,
    label: string,
    coverageDatesFunction:
      | ((year: number, isElectionYear: boolean, filingFrequency: string) => [Date, Date])
      | undefined,
  ) {
    this.code = code;
    this.label = label;
    this.coverageDatesFunction = coverageDatesFunction;
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
  if (isElectionYear) {
    return [new Date(year - 1, 9, 1), new Date(year - 1, 11, 31)];
  } else if (filingFrequency === 'Q') {
    return [new Date(year - 1, 6, 1), new Date(year - 1, 11, 31)];
  }
  return [new Date(year - 1, 11, 1), new Date(year - 1, 11, 31)];
}

/*
 *  These long-form labels include more detailed descriptions than the labels provided
 *  by the API and are used when creating a report and during the submission process.
 */
export const F3X_REPORT_CODE_MAP = new Map<F3xReportCodes, F3xReportCode>([
  [
    F3xReportCodes.Q1,
    new F3xReportCode(F3xReportCodes.Q1, 'APRIL 15 QUARTERLY REPORT (Q1)', createCoverageFunction(0, 1, 2, 31)),
  ],
  [
    F3xReportCodes.Q2,
    new F3xReportCode(F3xReportCodes.Q2, 'JULY 15 QUARTERLY REPORT (Q2)', createCoverageFunction(3, 1, 5, 30)),
  ],
  [
    F3xReportCodes.Q3,
    new F3xReportCode(F3xReportCodes.Q3, 'OCTOBER 15 QUARTERLY REPORT(Q3)', createCoverageFunction(6, 1, 8, 30)),
  ],
  [F3xReportCodes.YE, new F3xReportCode(F3xReportCodes.YE, 'JANUARY 31 YEAR-END (YE)', getYearEndCoverageDates)],
  [F3xReportCodes.TER, new F3xReportCode(F3xReportCodes.TER, 'TERMINATION REPORT (TER)', undefined)],
  [
    F3xReportCodes.MY,
    new F3xReportCode(F3xReportCodes.MY, 'JULY 31 MID-YEAR REPORT (MY)', createCoverageFunction(0, 1, 5, 30)),
  ],
  [F3xReportCodes.TwelveG, new F3xReportCode(F3xReportCodes.TwelveG, '12-DAY PRE-GENERAL (12G)', undefined)],
  [F3xReportCodes.TwelveP, new F3xReportCode(F3xReportCodes.TwelveP, '12-DAY PRE-PRIMARY (12P)', undefined)],
  [F3xReportCodes.TwelveR, new F3xReportCode(F3xReportCodes.TwelveR, '12-DAY PRE-RUNOFF (12R)', undefined)],
  [F3xReportCodes.TwelveS, new F3xReportCode(F3xReportCodes.TwelveS, '12-DAY PRE-SPECIAL (12S)', undefined)],
  [F3xReportCodes.TwelveC, new F3xReportCode(F3xReportCodes.TwelveC, '12-DAY PRE-CONVENTION (12C)', undefined)],
  [F3xReportCodes.ThirtyG, new F3xReportCode(F3xReportCodes.ThirtyG, '30-DAY POST-GENERAL (30G)', undefined)],
  [F3xReportCodes.ThirtyR, new F3xReportCode(F3xReportCodes.ThirtyR, '30-DAY POST-RUNOFF (30R)', undefined)],
  [F3xReportCodes.ThirtyS, new F3xReportCode(F3xReportCodes.ThirtyS, '30-DAY POST-SPECIAL (30S)', undefined)],
  [
    F3xReportCodes.M2,
    new F3xReportCode(F3xReportCodes.M2, 'FEBRUARY 20 MONTHLY REPORT (M2)', createCoverageFunction(0, 1, 0, 31)),
  ],
  // Note that new Date(yyyy, 2, 0) returns the last day of february dynamically (handles leap years)
  [
    F3xReportCodes.M3,
    new F3xReportCode(F3xReportCodes.M3, 'MARCH 20 MONTHLY REPORT (M3)', createCoverageFunction(1, 1, 2, 0)),
  ],
  [
    F3xReportCodes.M4,
    new F3xReportCode(F3xReportCodes.M4, 'APRIL 20 MONTHLY REPORT (M4)', createCoverageFunction(2, 1, 2, 31)),
  ],
  [
    F3xReportCodes.M5,
    new F3xReportCode(F3xReportCodes.M5, 'MAY 20 MONTHLY REPORT (M5)', createCoverageFunction(3, 1, 3, 30)),
  ],
  [
    F3xReportCodes.M6,
    new F3xReportCode(F3xReportCodes.M6, 'JUNE 20 MONTHLY REPORT (M6)', createCoverageFunction(4, 1, 4, 31)),
  ],
  [
    F3xReportCodes.M7,
    new F3xReportCode(F3xReportCodes.M7, 'JULY 20 MONTHLY REPORT (M7)', createCoverageFunction(5, 1, 5, 30)),
  ],
  [
    F3xReportCodes.M8,
    new F3xReportCode(F3xReportCodes.M8, 'AUGUST 20 MONTHLY REPORT (M8)', createCoverageFunction(6, 1, 6, 31)),
  ],
  [
    F3xReportCodes.M9,
    new F3xReportCode(F3xReportCodes.M9, 'SEPTEMBER 20 MONTHLY REPORT (M9)', createCoverageFunction(7, 1, 7, 31)),
  ],
  [
    F3xReportCodes.M10,
    new F3xReportCode(F3xReportCodes.M10, 'OCTOBER 20 MONTHLY REPORT (M10)', createCoverageFunction(8, 1, 8, 30)),
  ],
  [
    F3xReportCodes.M11,
    new F3xReportCode(F3xReportCodes.M11, 'NOVEMBER 20 MONTHLY REPORT (M11)', createCoverageFunction(9, 1, 9, 31)),
  ],
  [
    F3xReportCodes.M12,
    new F3xReportCode(F3xReportCodes.M12, 'DECEMBER 20 MONTHLY REPORT (M12)', createCoverageFunction(10, 1, 10, 30)),
  ],
]);

export function getReportCodeLabel(reportCode?: F3xReportCodes): string | undefined {
  if (reportCode) return F3X_REPORT_CODE_MAP.get(reportCode)?.label;
  else return undefined;
}

@Pipe({
  name: 'reportCodeLabel',
})
export class ReportCodeLabelPipe implements PipeTransform {
  transform(reportCode: F3xReportCodes | undefined): string {
    return getReportCodeLabel(reportCode) || '';
  }
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
