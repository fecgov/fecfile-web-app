import { Action, createReducer, on } from '@ngrx/store';
import { setServiceAvailableAction } from './service-available.actions';

export const initialState: boolean = true;

export const serviceAvailableReducer = createReducer<boolean | undefined, Action>(
  initialState,
  on(setServiceAvailableAction, (_state, update) => update.payload),
);
