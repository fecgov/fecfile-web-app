import { createFeatureSelector } from '@ngrx/store';
import { Form3X } from 'app/shared/models/form-3x.model';
import { Form99 } from 'app/shared/models/form-99.model';
import { Report } from 'app/shared/models/report.model';

export const selectActiveReport = createFeatureSelector<Report>('activeReport');
export const selectActiveForm3X = createFeatureSelector<Form3X>('activeReport');
export const selectActiveForm99 = createFeatureSelector<Form99>('activeReport');
