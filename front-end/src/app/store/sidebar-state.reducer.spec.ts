import { ReportSidebarState, SidebarState } from 'app/layout/sidebar/sidebar.component';
import { setSidebarStateAction } from './sidebar-state.actions';
import { sidebarStateReducer } from './sidebar-state.reducer';

describe('SidebarStateReducer', () => {
  it('it should store a sidebarState', () => {
    const sidebarState = new SidebarState(ReportSidebarState.TRANSACTIONS, '/url');
    const action = {
      type: setSidebarStateAction.type,
      payload: sidebarState,
    };
    const result = sidebarStateReducer(sidebarState, action);
    expect(result?.section).toBe(ReportSidebarState.TRANSACTIONS);
    expect(result?.url).toBe('/url');
  });
});
