import { singleClickReducer } from './single-click.reducer';
import { singleClickEnableAction, singleClickDisableAction } from './single-click.actions';

describe('SingleClick Reducer', () => {
  it('should enable single click', () => {
    const action = singleClickEnableAction();
    const state = singleClickReducer(false, action);
    expect(state).toBeFalse();
  });

  it('should disable single click', () => {
    const action = singleClickDisableAction();
    const state = singleClickReducer(true, action);
    expect(state).toBeTrue();
  });
});
