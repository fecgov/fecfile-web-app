import { setServiceAvailableAction } from './service-available.actions';
import { serviceAvailableReducer } from './service-available.reducer';

describe('ServiceAvailableReducer', () => {
  it('it should store the service available state', () => {
    const action = setServiceAvailableAction({ payload: true });
    const result = serviceAvailableReducer(true, action);
    expect(result).toStrictEqual(true);
  });
});
