import { createFeatureSelector } from '@ngrx/store';
import { CashOnHand } from 'app/shared/models/form-3x.model';

export const selectCashOnHand = createFeatureSelector<CashOnHand>('cashOnHand');
