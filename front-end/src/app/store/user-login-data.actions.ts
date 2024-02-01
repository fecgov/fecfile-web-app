import { createAction, props } from '@ngrx/store';
import { UserLoginData } from '../shared/models/user.model';

export const setUserLoginDataAction = createAction('[User Login Data] Save', props<{ payload?: UserLoginData }>());
