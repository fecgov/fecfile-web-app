import { createFeatureSelector } from '@ngrx/store';
import { ReportTypes } from '../shared/models/report.model';

export const selectActiveReport = createFeatureSelector<ReportTypes>('activeReport');
