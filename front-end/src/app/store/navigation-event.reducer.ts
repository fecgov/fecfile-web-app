import { Action, createReducer, on } from '@ngrx/store';
import { navigationEventClearAction, navigationEventSetAction } from './navigation-event.actions';
import { NavigationEvent } from 'app/shared/models/transaction-navigation-controls.model';

export const initialState: NavigationEvent | undefined = undefined;

export const navigationEventReducer = createReducer<NavigationEvent | undefined, Action>(
  initialState,
  on(navigationEventSetAction, (_state, update) => update),
  on(navigationEventClearAction, () => undefined),
);
