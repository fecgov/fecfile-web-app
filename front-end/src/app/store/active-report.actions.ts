import { createAction, props } from '@ngrx/store';
import type { Report } from 'app/shared/models/reports/report.model';

export const setActiveReportAction = createAction('[Active Report] Save', props<{ payload: Report | undefined }>());
