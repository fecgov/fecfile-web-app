import { createFeatureSelector } from '@ngrx/store';
import { Report } from 'app/shared/models/report-types/report.model';

export const selectActiveReport = createFeatureSelector<Report>('activeReport');
