import { createFeatureSelector } from '@ngrx/store';
import type { Report } from 'app/shared/models/reports/report.model';

export const selectActiveReport = createFeatureSelector<Report>('activeReport');
