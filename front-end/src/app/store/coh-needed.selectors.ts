import { createFeatureSelector } from '@ngrx/store';

export const selectCohNeededStatus = createFeatureSelector<boolean>('cohNeeded');
