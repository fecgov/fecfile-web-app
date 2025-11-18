import { createFeatureSelector } from '@ngrx/store';
import { Report } from 'app/shared/models/reports/report.model';

export const selectActiveReport = createFeatureSelector<Report>('activeReport');
