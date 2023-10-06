import { createReducer, on } from '@ngrx/store';
import { CashOnHand } from 'app/shared/models/report-f3x.model';
import { setCashOnHandAction } from './cash-on-hand.actions';

export const initialState: CashOnHand = {
  report_id: undefined,
  value: undefined,
};

export const cashOnHandReducer = createReducer<CashOnHand>(
  initialState,
  on(setCashOnHandAction, (_state, update) => update.payload)
);
