import { DateUtils } from './date.utils';

export type FilingFrequency = 'Q' | 'M';
export type Form3Situation =
  | 'Form3_Quarterly_Election'
  | 'Form3_Quarterly_NonElection'
  | 'Form3X_Quarterly_Election'
  | 'Form3X_Quarterly_NonElection'
  | 'Form3X_Monthly_Election'
  | 'Form3X_Monthly_NonElection';

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
  reportCode: ReportCodes,
  year: number,
  isElectionYear: boolean,
  filingFrequency: FilingFrequency,
): [Date | undefined, Date] | undefined {
  if (reportCode === ReportCodes.YE) {
    const adjustedYear = DateUtils.isCurrentMonthJanuary() ? year - 1 : year;
    if (isElectionYear) {
      return [undefined, new Date(adjustedYear, 11, 31)];
    }
    if (filingFrequency === 'Q') {
      return [new Date(adjustedYear, 6, 1), new Date(adjustedYear, 11, 31)];
    }
    return [new Date(adjustedYear, 11, 1), new Date(adjustedYear, 11, 31)];
  }

  const staticDateMap: Partial<Record<ReportCodes, [Date, Date]>> = {
    [ReportCodes.Q1]: [new Date(year, 0, 1), new Date(year, 3, 0)],
    [ReportCodes.Q2]: [new Date(year, 3, 1), new Date(year, 6, 0)],
    [ReportCodes.Q3]: [new Date(year, 6, 1), new Date(year, 9, 0)],
    [ReportCodes.MY]: [new Date(year, 0, 1), new Date(year, 6, 0)],
    [ReportCodes.M2]: [new Date(year, 0, 1), new Date(year, 1, 0)],
    [ReportCodes.M3]: [new Date(year, 1, 1), new Date(year, 2, 0)],
    [ReportCodes.M4]: [new Date(year, 2, 1), new Date(year, 3, 0)],
    [ReportCodes.M5]: [new Date(year, 3, 1), new Date(year, 4, 0)],
    [ReportCodes.M6]: [new Date(year, 4, 1), new Date(year, 5, 0)],
    [ReportCodes.M7]: [new Date(year, 5, 1), new Date(year, 6, 0)],
    [ReportCodes.M8]: [new Date(year, 6, 1), new Date(year, 7, 0)],
    [ReportCodes.M9]: [new Date(year, 7, 1), new Date(year, 8, 0)],
    [ReportCodes.M10]: [new Date(year, 8, 1), new Date(year, 9, 0)],
    [ReportCodes.M11]: [new Date(year, 9, 1), new Date(year, 10, 0)],
    [ReportCodes.M12]: [new Date(year, 10, 1), new Date(year, 11, 0)],
  };
  return staticDateMap[reportCode];
}

export function getReportCodes(isElectionYear: boolean, filingFrequency: FilingFrequency, isForm3X: boolean) {
  const formPart = isForm3X ? 'Form3X' : 'Form3';
  const freqPart = filingFrequency === 'M' ? 'Monthly' : 'Quarterly';
  const electPart = isElectionYear ? 'Election' : 'NonElection';
  const situationKey = `${formPart}_${freqPart}_${electPart}` as Form3Situation;
  return SITUATION_REPORT_MAP[situationKey] || [];
}

export const SITUATION_REPORT_MAP: Record<Form3Situation, ReportCodes[]> = {
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

export const electionReportCodes: ReportCodes[] = [
  ReportCodes['30G'],
  ReportCodes['30R'],
  ReportCodes['30S'],
  ReportCodes['12C'],
  ReportCodes['12G'],
  ReportCodes['12P'],
  ReportCodes['12R'],
  ReportCodes['12S'],
];
