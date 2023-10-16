import { createFeatureSelector } from '@ngrx/store';
import { ReportF3X } from '../shared/models/report-f3x.model';

export const selectActiveReport = createFeatureSelector<ReportF3X>('activeReport');
