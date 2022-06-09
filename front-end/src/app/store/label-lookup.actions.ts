import { createAction, props } from '@ngrx/store';
import { LabelList, ReportCodeLabelList } from '../shared/utils/label.utils';

export const setLabelLookupAction = createAction(
  '[Report Code Label List] Label List Retrieved',
  props<{ payload: ReportCodeLabelList }>()
);

export const errorRetrievingLabelLookupAction = createAction('[Label List] Account Loaded Error');
export const selectLabelLookupAction = createAction('[Label List] Select Data');
