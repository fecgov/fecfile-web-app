import { cohNeededReducer } from './coh-needed.reducer';
import { cohNeededAction } from './coh-needed.actions';

describe('CohNeededReducer', () => {
  it('it should store the boolean status', () => {
    const action = {
      type: cohNeededAction.type,
      payload: true,
    };
    const result = cohNeededReducer(true, action);
    expect(result).toBe(true);
  });
});
