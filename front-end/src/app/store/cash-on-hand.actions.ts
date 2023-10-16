import { createAction, props } from '@ngrx/store';
import { CashOnHand } from 'app/shared/models/form-3x.model';

export const setCashOnHandAction = createAction('[Cash On Hand]', props<{ payload: CashOnHand }>());
