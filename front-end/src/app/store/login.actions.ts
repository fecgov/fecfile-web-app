import { createAction, props } from '@ngrx/store';
import { UserLoginData } from '../shared/models/user.model';

export const userLoggedInAction = createAction('[Login] User Logged In', props<{ payload: UserLoginData }>());
export const userLoggedOutAction = createAction('[Login] User Logged Out');
