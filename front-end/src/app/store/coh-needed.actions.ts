import { createAction, props } from '@ngrx/store';

export const cohNeededAction = createAction('[COH Needed]', props<{ payload: boolean }>());
