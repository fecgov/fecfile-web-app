import { createFeatureSelector } from '@ngrx/store';
import { CashOnHand } from 'app/shared/interfaces/report.interface';

export const selectCashOnHand = createFeatureSelector<CashOnHand>('cashOnHand');
