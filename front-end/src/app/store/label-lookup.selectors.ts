import { createFeatureSelector } from '@ngrx/store';
import { ReportCodeLabelList } from '../shared/utils/reportCodeLabels.utils';

export const selectReportCodeLabelList = createFeatureSelector<ReportCodeLabelList>('reportCodeLabelList');
