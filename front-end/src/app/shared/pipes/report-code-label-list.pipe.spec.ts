import { ReportCodeLabelList } from '../utils/reportCodeLabels.utils';
import { FindOnReportCodePipe } from './report-code-label-list.pipe';

describe('FindOnReportCodePipe', () => {
  const labelList: ReportCodeLabelList = [
    {
      label: 'Quarter 1',
      report_code: 'Q1',
    },
    {
      label: 'Quarter 2',
      report_code: 'Q2',
    },
  ];
  let pipe: FindOnReportCodePipe;

  beforeEach(() => {
    pipe = new FindOnReportCodePipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('transforms should return a ReportCodeLabel object', () => {
    expect(pipe.transform(labelList, 'Q1')).toEqual({ label: 'Quarter 1', report_code: 'Q1' });
    expect(pipe.transform(labelList, 'Q2')).toEqual({ label: 'Quarter 2', report_code: 'Q2' });
  });

  it('transforms should return empty ReportCodeLabel object if no label found', () => {
    expect(pipe.transform(labelList, 'does-not-exist')).toBe(undefined);
  });

  it('transforms should return an empty ReportCodeLabel object if the labelList is null', () => {
    expect(pipe.transform(null, 'Q1')).toBe(undefined);
  });

  it('transforms should return undefined if value is null', () => {
    expect(pipe.transform(labelList, null)).toBe(undefined);
  });
});
