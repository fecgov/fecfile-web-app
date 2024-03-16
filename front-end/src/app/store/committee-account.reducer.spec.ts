import { committeeAccountReducer } from './committee-account.reducer';
import { setCommitteeAccountDetailsAction } from './committee-account.actions';
import { userLoginDataDiscardedAction } from './user-login-data.actions';
import { CommitteeAccount } from '../shared/models/committee-account.model';

describe('CommitteeAccountReducer', () => {
  it('it should store a committeeAccount', () => {
    const committeeAccount = CommitteeAccount.fromJSON({ id: '999' });
    const action = {
      type: setCommitteeAccountDetailsAction.type,
      payload: committeeAccount,
    };
    const result = committeeAccountReducer(committeeAccount, action);
    expect(result.id).toBe('999');
  });

  it('it should set initial state when login discarded', () => {
    const committeeAccount = CommitteeAccount.fromJSON({ id: '999' });
    const action = {
      type: userLoginDataDiscardedAction.type,
    };
    const result = committeeAccountReducer(committeeAccount, action);
    expect(result.id).toBeUndefined();
  });
});
