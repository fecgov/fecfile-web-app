import { ReportSidebarState, SidebarState } from 'app/layout/sidebar/sidebar.component';
import { setSidebarStateAction, toggleSidebarVisibleAction } from './sidebar-state.actions';
import { sidebarStateReducer, sidebarVisibleReducer } from './sidebar-state.reducer';

describe('SidebarStateReducer', () => {
  it('it should store a sidebarState', () => {
    const sidebarState = new SidebarState(ReportSidebarState.TRANSACTIONS);
    const action = {
      type: setSidebarStateAction.type,
      payload: sidebarState,
    };
    const result = sidebarStateReducer(sidebarState, action);
    expect(result?.section).toBe(ReportSidebarState.TRANSACTIONS);
  });
});

describe('SidebarVisibleReducer', () => {
  it('should toggle the sidebar visibility', () => {
    const visible = true;
    const action = {
      type: toggleSidebarVisibleAction.type,
    }
    const result = sidebarVisibleReducer(visible, action);
    expect(result).toBeFalsy();
  })
})