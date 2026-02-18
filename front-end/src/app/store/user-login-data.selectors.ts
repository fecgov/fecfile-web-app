import { createFeatureSelector } from '@ngrx/store';
import type { UserLoginData } from '../shared/models/user.model';

export const selectUserLoginData = createFeatureSelector<UserLoginData>('userLoginData');
