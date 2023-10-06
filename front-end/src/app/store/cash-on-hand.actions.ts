import { createAction, props } from '@ngrx/store';
import { CashOnHand } from 'app/shared/models/report-f3x.model';

export const setCashOnHandAction = createAction('[Cash On Hand]', props<{ payload: CashOnHand }>());
