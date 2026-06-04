import { createFeatureSelector } from '@ngrx/store';

export const selectSingleClickDisabled = createFeatureSelector<boolean>('singleClickDisabled');
