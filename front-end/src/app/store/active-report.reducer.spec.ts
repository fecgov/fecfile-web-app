import { activeReportReducer } from './active-report.reducer';
import { setActiveReportAction } from './active-report.actions';
import { F3xReport } from '../shared/models/report-types/f3x-report.model';

describe('ActiveReportReducer', () => {
  it('it should store a report', () => {
    const report = F3xReport.fromJSON({ id: '999' });
    const action = {
      type: setActiveReportAction.type,
      payload: report,
    };
    const result = activeReportReducer(report, action);
    expect(result?.id).toBe('999');
  });
});
