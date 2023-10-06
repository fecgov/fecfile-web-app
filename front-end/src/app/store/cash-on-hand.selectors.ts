import { createFeatureSelector } from '@ngrx/store';
import { CashOnHand } from 'app/shared/models/report-f3x.model';

export const selectCashOnHand = createFeatureSelector<CashOnHand>('cashOnHand');
