import { createAction, props } from '@ngrx/store';

export const setServiceAvailableAction = createAction(
  '[ServiceAvailable] Update',
  props<{ payload: undefined | boolean }>(),
);
