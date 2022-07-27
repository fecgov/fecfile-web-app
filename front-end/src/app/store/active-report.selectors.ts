import { createFeatureSelector } from '@ngrx/store';
import { Report } from '../shared/interfaces/report.interface';

export const selectActiveReport = createFeatureSelector<Report | null>('activeReport');
