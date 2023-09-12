import { createFeatureSelector } from '@ngrx/store';
import { CashOnHand } from 'app/shared/interfaces/cash-on-hand.interface';

export const selectCashOnHand = createFeatureSelector<CashOnHand>('cashOnHand');
