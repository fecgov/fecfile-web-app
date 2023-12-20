import { createFeatureSelector } from '@ngrx/store';
import { Report } from 'app/shared/models/report.model';

export const selectActiveReport = createFeatureSelector<Report>('activeReport');
