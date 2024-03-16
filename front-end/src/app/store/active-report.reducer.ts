import { Action, createReducer, on } from '@ngrx/store';
import { Report } from '../shared/models/report.model';
import { setActiveReportAction } from './active-report.actions';
import { userLoginDataDiscardedAction } from './user-login-data.actions';


export const initialState: Report | undefined = undefined;

export const activeReportReducer = createReducer<Report | undefined, Action>(
  initialState,
  on(setActiveReportAction, (_state, update) => update.payload),
  on(userLoginDataDiscardedAction, () => initialState),
);
