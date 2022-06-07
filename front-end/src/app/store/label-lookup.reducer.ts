import { createReducer, on, Action } from '@ngrx/store';
import { setLabelLookupAction } from './label-lookup.actions';
import { LabelList } from '../shared/utils/label.utils';

export const initialState: LabelList = [];

const _labelLookupReducer = createReducer(
  initialState,
  on(setLabelLookupAction, (state, update) => update.payload)
);

export function labelLookupReducer(state: LabelList | undefined, action: Action) {
  return _labelLookupReducer(state, action);
}
