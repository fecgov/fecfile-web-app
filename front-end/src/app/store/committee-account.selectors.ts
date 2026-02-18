import { createFeatureSelector } from '@ngrx/store';
import type { CommitteeAccount } from '../shared/models/committee-account.model';

export const selectCommitteeAccount = createFeatureSelector<CommitteeAccount>('committeeAccount');
