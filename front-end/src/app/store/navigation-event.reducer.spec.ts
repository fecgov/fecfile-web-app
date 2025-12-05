import { navigationEventReducer } from './navigation-event.reducer';
import { navigationEventSetAction } from './navigation-event.actions';
import {
  NavigationEvent,
  NavigationAction,
  NavigationDestination,
} from '../shared/models/transaction-navigation-controls.model';

describe('NavigationEvent Reducer', () => {
  it('should set navigation event', () => {
    const initialState: NavigationEvent | undefined = undefined;
    const event: NavigationEvent = {
      action: NavigationAction.SAVE,
      destination: NavigationDestination.LIST,
    };
    const action = navigationEventSetAction(event);
    const state = navigationEventReducer(initialState, action);
    expect(state).toEqual(event);
  });
});
