import { createFeatureSelector } from '@ngrx/store';

export const selectSpinnerStatus = createFeatureSelector<{ spinnerOn: boolean }>('spinnerOn');
