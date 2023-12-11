import { Action, createReducer, on } from '@ngrx/store';
import { SidebarState } from 'app/layout/sidebar/sidebar.component';
import { setSidebarStateAction, toggleSidebarVisibleAction } from './sidebar-state.actions';

export const initialState: SidebarState | undefined = undefined;

export const sidebarStateReducer = createReducer<SidebarState | undefined, Action>(
  initialState,
  on(setSidebarStateAction, (_state, update) => update.payload)
);
export const sidebarVisibleReducer = createReducer<boolean, Action>(
  true,
  on(toggleSidebarVisibleAction, (_state) => !_state),
);
