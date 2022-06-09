import { createAction, props } from '@ngrx/store';
import { LabelList } from '../shared/utils/label.utils';
import { ReportCodeLabelList } from '../shared/utils/reportCodeLabels.utils';

export const setLabelLookupAction = createAction(
  '[Label Lookup] Report Code Labels Retrieved',
  props<{ payload: ReportCodeLabelList }>()
);

export const errorRetrievingLabelLookupAction = createAction('[Label Lookup] Report Code Labels Retrieval Error');
export const updateLabelLookupAction = createAction('[Label List] Update Report Code Labels');
