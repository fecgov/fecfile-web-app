import { createFeatureSelector } from '@ngrx/store';
import { Report } from '../shared/models/report.model';

export const selectActiveReport = createFeatureSelector<Report>('activeReport');
