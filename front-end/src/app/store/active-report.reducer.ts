import { createReducer, on, Action } from '@ngrx/store';
import { setActiveReportAction } from './active-report.actions';
import { Report } from '../shared/interfaces/report.interface';

export const initialState: Report | null = null;

const _activeReportReducer = createReducer<Report | null, Action>(
  initialState,
  on(setActiveReportAction, (state, update) => update.payload)
);

export function activeReportReducer(state: Report | null | undefined, action: Action) {
  return _activeReportReducer(state, action);
}
