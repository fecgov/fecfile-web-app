import { createAction, props } from '@ngrx/store';
import { LabelList, ReportCodeLabelList } from '../shared/utils/label.utils';

export const setLabelLookupAction = createAction(
  '[Label Lookup] Report Code Labels Retrieved',
  props<{ payload: ReportCodeLabelList }>()
);

export const errorRetrievingLabelLookupAction = createAction('[Label Lookup] Report Code Labels Retrieval Error');
export const updateLabelLookupAction = createAction('[Label List] Update Report Code Labels');
