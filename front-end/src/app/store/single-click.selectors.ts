import { createFeatureSelector } from '@ngrx/store';

export const selectSingleClickDisabled = createFeatureSelector<{ singleClickDisabled: boolean }>('singleClickDisabled');
