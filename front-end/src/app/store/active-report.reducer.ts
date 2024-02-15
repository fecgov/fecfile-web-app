import { Action, createReducer, on } from '@ngrx/store';
import { setActiveReportAction } from './active-report.actions';
import { Report } from '../shared/models/report.model';

export const initialState: Report | undefined = undefined;

export const activeReportReducer = createReducer<Report | undefined, Action>(
  initialState,
  on(setActiveReportAction, (_state, update) => update.payload),
);
