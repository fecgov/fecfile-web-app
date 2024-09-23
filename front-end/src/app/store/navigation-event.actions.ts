import { createAction, props } from '@ngrx/store';
import { NavigationEvent } from 'app/shared/models/transaction-navigation-controls.model';

export const navigationEventSetAction = createAction('[Navigation Event] Created', props<NavigationEvent>());

export const navigationEventClearAction = createAction('[Navigation Event] Queue Cleared');
