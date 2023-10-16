import { createAction, props } from '@ngrx/store';
import { Report } from 'app/shared/models/report.model';

export const setActiveReportAction = createAction('[Active Report] Save', props<{ payload: Report | undefined }>());
