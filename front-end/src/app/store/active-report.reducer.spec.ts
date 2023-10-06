import { activeReportReducer } from './active-report.reducer';
import { setActiveReportAction } from './active-report.actions';
import { ReportF3X } from '../shared/models/report-f3x.model';

describe('ActiveReportReducer', () => {
  it('it should store a report', () => {
    const report = ReportF3X.fromJSON({ id: '999' });
    const action = {
      type: setActiveReportAction.type,
      payload: report,
    };
    const result = activeReportReducer(report, action);
    expect(result?.id).toBe('999');
  });
});
