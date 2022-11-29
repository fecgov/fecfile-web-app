import { createReducer, on, Action } from '@ngrx/store';
import { setLabelLookupAction } from './label-lookup.actions';
import { ReportCodeLabelList } from '../shared/utils/reportCodeLabels.utils';

export const initialState: ReportCodeLabelList = [];

export const labelLookupReducer = createReducer(
  initialState,
  on(setLabelLookupAction, (_state, update) => update.payload)
);
