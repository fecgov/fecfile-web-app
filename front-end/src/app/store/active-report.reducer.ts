import { createReducer, on, Action } from '@ngrx/store';
import { setActiveReportAction } from './active-report.actions';
import { Report } from '../shared/interfaces/report.interface';

export const initialState: Report | undefined = undefined;

const _activeReportReducer = createReducer<Report | undefined, Action>(
  initialState,
  on(setActiveReportAction, (_state, update) => update.payload)
);

export function activeReportReducer(state: Report | undefined, action: Action) {
  return _activeReportReducer(state, action);
}
