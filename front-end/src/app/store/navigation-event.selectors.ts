import { createFeatureSelector } from '@ngrx/store';
import { NavigationEvent } from 'app/shared/models/transaction-navigation-controls.model';

export const selectNavigationEvent = createFeatureSelector<NavigationEvent>('navigationEvent');
