import { createReducer, on, Action } from '@ngrx/store';
import { setActiveReportAction } from './active-report.actions';
import { Report } from 'app/shared/models/report-types/report.model';

export const initialState: Report | undefined = undefined;

export const activeReportReducer = createReducer<Report | undefined, Action>(
  initialState,
  on(setActiveReportAction, (_state, update) => update.payload)
);
