import { createFeatureSelector } from '@ngrx/store';
import { ReportCodeLabelList } from '../shared/utils/label.utils';

export const selectReportCodeLabelList = createFeatureSelector<ReportCodeLabelList>('reportCodeLabelList');
