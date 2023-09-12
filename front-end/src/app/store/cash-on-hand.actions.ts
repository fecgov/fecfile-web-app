import { createAction, props } from '@ngrx/store';
import { CashOnHand } from 'app/shared/interfaces/cash-on-hand.interface';

export const setCashOnHandAction = createAction('[Cash On Hand]', props<{ payload: CashOnHand }>());
