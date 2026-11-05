export interface LineSummary {
  lineNumber: string;
  description: string;
  thisPeriod?: number;
  valueToDate?: number;
  electionCycleTotal?: number;
  bold?: boolean;
  italic?: boolean;
  overlay?: string;
  indent?: number;
}

export const F3LineCodes = [
  'L6a',
  'L6b',
  'L6c',
  'L7a',
  'L7b',
  'L7c',
  'L8',
  'L9',
  'L10',
  'L11ai',
  'L11aii',
  'L11aiii',
  'L11b',
  'L11c',
  'L11d',
  'L11e',
  'L12',
  'L13a',
  'L13b',
  'L13c',
  'L14',
  'L15',
  'L16',
  'L17',
  'L18',
  'L19a',
  'L19b',
  'L19c',
  'L20a',
  'L20b',
  'L20c',
  'L20d',
  'L21',
  'L22',
  'L23',
  'L24',
  'L25',
  'L26',
  'L27',
] as const;

export type F3LineCode = (typeof F3LineCodes)[number];

export const F3XLineCodes = [
  'L6a',
  'L6b',
  'L6c',
  'L6d',
  'L7',
  'L8',
  'L9',
  'L10',
  'L11ai',
  'L11aii',
  'L11aiii',
  'L11b',
  'L11c',
  'L11d',
  'L12',
  'L13',
  'L14',
  'L15',
  'L16',
  'L17',
  'L18a',
  'L18b',
  'L18c',
  'L19',
  'L20',
  'L21ai',
  'L21aii',
  'L21b',
  'L21c',
  'L22',
  'L23',
  'L24',
  'L25',
  'L26',
  'L27',
  'L28a',
  'L28b',
  'L28c',
  'L28d',
  'L29',
  'L30ai',
  'L30aii',
  'L30b',
  'L30c',
  'L31',
  'L32',
  'L33',
  'L34',
  'L35',
  'L36',
  'L37',
  'L38',
];

export type F3XLineCode = (typeof F3XLineCodes)[number];

export class Lines<T extends string> {
  [key: string]: number | undefined;
}

type LineSummaryOptions = Omit<LineSummary, 'lineNumber' | 'description' | 'thisPeriod' | 'valueToDate'>;
export function lineSummary<T extends string>(
  report: {
    period: Lines<T>;
    ytd: Lines<T>;
    electionCycleCalculations?: Lines<T>;
  },
  line: T,
  lineNumber: string,
  description: string,
  options: LineSummaryOptions = {},
): LineSummary {
  return {
    lineNumber,
    description,
    thisPeriod: report.period[line] as number | undefined,
    valueToDate: report.ytd[line] as number | undefined,
    electionCycleTotal: report.electionCycleCalculations?.[line] as number | undefined,
    ...options,
  };
}

export function lineHeading(lineNumber: string, description: string, options: LineSummaryOptions = {}): LineSummary {
  return { lineNumber, description, ...options };
}
export function transformLines<T extends string>(source: Record<string, unknown>, suffix: 'period' | 'ytd'): Lines<T> {
  const lines = new Lines<T>();

  Object.entries(source).forEach(([key, value]) => {
    const regex = /^(L\d+[a-z]*)_.+_(period|ytd)$/;
    const match = regex.exec(key);
    if (
      match?.[2] !== suffix ||
      key === 'L6a_year_for_above_ytd' ||
      (typeof value !== 'string' && typeof value !== 'number')
    )
      return;
    const amount = Number(value);
    if (Number.isFinite(amount)) lines[match[1] as T] = amount;
  });

  return lines;
}

export function createEmptyLines<T extends string>(lineCodes: readonly T[]): Lines<T> {
  const lines = new Lines<T>();

  lineCodes.forEach((line) => {
    lines[line] = 0;
  });

  return lines;
}
