import { createReducer, on, Action } from '@ngrx/store';
import { SidebarState } from 'app/layout/sidebar/sidebar.component';
import { setSidebarStateAction } from './sidebar-state.actions';

export const initialState: SidebarState | undefined = undefined;

export const sidebarStateReducer = createReducer<SidebarState | undefined, Action>(
  initialState,
  on(setSidebarStateAction, (_state, update) => update.payload)
);