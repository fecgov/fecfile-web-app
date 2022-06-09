import { createReducer, on, Action } from '@ngrx/store';
import { setLabelLookupAction } from './label-lookup.actions';
import { LabelList, ReportCodeLabelList } from '../shared/utils/label.utils';

export const initialState: ReportCodeLabelList = [];

const _labelLookupReducer = createReducer(
  initialState,
  on(setLabelLookupAction, (state, update) => update.payload)
);

export function labelLookupReducer(state: ReportCodeLabelList | undefined, action: Action) {
  console.log('Label-Lookup Reducer called', state, action);
  return _labelLookupReducer(state, action);
}
