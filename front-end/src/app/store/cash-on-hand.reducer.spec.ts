import { cashOnHandReducer } from './cash-on-hand.reducer';
import { setCashOnHandAction } from './cash-on-hand.actions';
import { CashOnHand } from 'app/shared/models/form-3x.model';

describe('Cash On Hand Reducer', () => {
  it('it should store the boolean status', () => {
    const state: CashOnHand = {
      report_id: undefined,
      value: undefined,
    };

    const action = {
      type: setCashOnHandAction.type,
      payload: {
        report_id: '999',
        value: 100.0,
      },
    };
    const result = cashOnHandReducer(state, action);
    expect(result.report_id).toBe('999');
    expect(result.value).toBe(100.0);
  });
});
