import { createReducer, on, Action } from '@ngrx/store';
import { spinnerOnAction, spinnerOffAction } from './spinner.actions';

export const spinnerReducer = createReducer(
  false,
  on(spinnerOnAction, () => true),
  on(spinnerOffAction, () => false)
);
