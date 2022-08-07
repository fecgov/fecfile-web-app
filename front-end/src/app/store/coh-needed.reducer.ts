import { createReducer, on, Action } from '@ngrx/store';
import { cohNeededAction } from './coh-needed.actions';

const _cohNeededReducer = createReducer(
  false,
  on(cohNeededAction, (_state, update) => update.payload)
);

export function cohNeededReducer(state: boolean | undefined, action: Action) {
  return _cohNeededReducer(state, action);
}
