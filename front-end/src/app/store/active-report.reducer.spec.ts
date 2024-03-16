import { activeReportReducer } from './active-report.reducer';
import { setActiveReportAction } from './active-report.actions';
import { userLoginDataDiscardedAction } from './user-login-data.actions';
import { Form3X } from '../shared/models/form-3x.model';

describe('ActiveReportReducer', () => {
  it('it should store a report', () => {
    const report = Form3X.fromJSON({ id: '999' });
    const action = {
      type: setActiveReportAction.type,
      payload: report,
    };
    const result = activeReportReducer(report, action);
    expect(result?.id).toBe('999');
  });

  it('it should set initial state when login discarded', () => {
    const report = Form3X.fromJSON({ id: '999' });
    const action = {
      type: userLoginDataDiscardedAction.type,
    };
    const result = activeReportReducer(report, action);
    expect(result).toBeUndefined();
  });
});
