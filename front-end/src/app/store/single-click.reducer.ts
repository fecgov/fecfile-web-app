import { createReducer, on } from '@ngrx/store';
import { singleClickDisableAction, singleClickEnableAction } from './single-click.actions';

export const singleClickReducer = createReducer(
  false,
  on(singleClickDisableAction, () => true),
  on(singleClickEnableAction, () => false)
);
