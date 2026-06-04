import { createFeatureSelector } from '@ngrx/store';

export const selectServiceAvailable = createFeatureSelector<boolean | undefined>('serviceAvailable');
