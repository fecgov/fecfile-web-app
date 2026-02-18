import { createFeatureSelector } from '@ngrx/store';
import type { NavigationEvent } from 'app/shared/models/transaction-navigation-controls.model';

export const selectNavigationEvent = createFeatureSelector<NavigationEvent>('navigationEvent');
