import { createReducer, on, Action } from '@ngrx/store';
import { spinnerOnAction, spinnerOffAction } from './spinner.actions';

const _spinnerReducer = createReducer(
  false,
  on(spinnerOnAction, () => true),
  on(spinnerOffAction, () => false)
);

export function spinnerReducer(state: boolean | undefined, action: Action) {
  return _spinnerReducer(state, action);
}
