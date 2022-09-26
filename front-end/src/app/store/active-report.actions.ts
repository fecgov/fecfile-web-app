import { createAction, props } from '@ngrx/store';
import { Report } from 'app/shared/interfaces/report.interface';

export const setActiveReportAction = createAction('[Active Report] Save', props<{ payload: Report | undefined }>());
