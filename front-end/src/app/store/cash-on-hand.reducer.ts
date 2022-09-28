import { createReducer, on, Action } from '@ngrx/store';
import { CashOnHand } from 'app/shared/interfaces/report.interface';
import { setCashOnHandAction } from './cash-on-hand.actions';

export const initialState: CashOnHand = {
  report_id: undefined,
  value: undefined,
};

const _cashOnHandReducer = createReducer<CashOnHand>(
  initialState,
  on(setCashOnHandAction, (_state, update) => update.payload)
);

export function cashOnHandReducer(state: CashOnHand | undefined, action: Action) {
  return _cashOnHandReducer(state, action);
}
