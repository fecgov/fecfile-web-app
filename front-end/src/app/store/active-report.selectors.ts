import { createFeatureSelector } from '@ngrx/store';
import { Form3X } from 'app/shared/models/form-3x.model';

export const selectActiveReport = createFeatureSelector<Form3X>('activeReport');
