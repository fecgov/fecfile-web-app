import { createFeatureSelector } from '@ngrx/store';
import { CommitteeAccount } from '../shared/models/committee-account.model';

export const selectCommitteeAccount = createFeatureSelector<CommitteeAccount>('committeeAccount');
