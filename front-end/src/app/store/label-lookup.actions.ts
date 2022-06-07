import { createAction, props } from "@ngrx/store";
import { LabelList } from "../shared/utils/label.utils";

export const setLabelLookupAction = createAction(
  "[Committee Account] Account Retrieved",
  props<{ payload: LabelList }>()
);

export const errorRetrievingLabelLookupAction = createAction(
  "[Label List] Account Loaded Error"
);
export const refreshLabelLookupAction = createAction(
  "[Label List] Refresh Data"
);
